
#!/usr/bin/env python3
"""
Parser for extracting trunk content from 1000-24000 from the uploaded file.
"""

import re
import argparse

def parse_trunks(file_path):
    """Parse the file and extract all trunk content from 1000-24000."""
    
    trunks = {}
    current_trunk = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Method 1: Check if this line contains a trunk header with number on next line
        if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]\s*\d+\s*—', line):
            # Look for trunk number on next line
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                trunk_match = re.search(r'^(\d+)\)$', next_line)
                if trunk_match:
                    trunk_num = int(trunk_match.group(1))
                    if 1000 <= trunk_num <= 24000:
                        # Extract title from current line
                        title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]\s*\d+\s*—\s*(.+)', line)
                        title = title_match.group(1).strip() if title_match else f"Trunk {trunk_num}"
                        
                        # Look for description on the line after trunk number
                        description = ""
                        if i + 2 < len(lines):
                            desc_line = lines[i + 2].strip()
                            if desc_line and not desc_line.startswith('-') and not re.search(r'^[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]', desc_line):
                                description = desc_line
                        
                        current_trunk = trunk_num
                        trunks[trunk_num] = {
                            'title': title,
                            'description': description,
                            'entries': [],
                            'metadata': [],
                            'cross_refs': []
                        }
        
        # Method 2: Check for inline trunk references like "(Trunk 1000)" or "(Original Trunk 17000)"
        trunk_match = re.search(r'\((?:Original )?Trunk (\d+)\)', line)
        if trunk_match:
            trunk_num = int(trunk_match.group(1))
            if 1000 <= trunk_num <= 24000 and trunk_num not in trunks:
                # Extract title before (Trunk XXXX)
                title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]\s*\d+\s*—\s*([^(]+)', line)
                title = title_match.group(1).strip() if title_match else f"Trunk {trunk_num}"
                
                current_trunk = trunk_num
                trunks[trunk_num] = {
                    'title': title,
                    'description': "",
                    'entries': [],
                    'metadata': [],
                    'cross_refs': []
                }
        
        # Method 3: Check for lines that end with just a trunk number like "Trunk 6000)"
        trunk_match = re.search(r'Trunk (\d+)\)$', line)
        if trunk_match:
            trunk_num = int(trunk_match.group(1))
            if 1000 <= trunk_num <= 24000 and trunk_num not in trunks:
                # Look back for the title on previous lines
                title = f"Trunk {trunk_num}"
                for j in range(max(0, i-3), i):
                    prev_line = lines[j].strip()
                    if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]\s*\d+\s*—', prev_line):
                        title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖]\s*\d+\s*—\s*(.+)', prev_line)
                        if title_match:
                            title = title_match.group(1).strip()
                            break
                
                current_trunk = trunk_num
                trunks[trunk_num] = {
                    'title': title,
                    'description': "",
                    'entries': [],
                    'metadata': [],
                    'cross_refs': []
                }
        
        # Method 4: Check for patterns like "Trunks 12000 & 19000)" or "Trunks: 3000, 13000, 3900)"
        multi_trunk_match = re.search(r'Trunks?:?\s*([0-9,\s&]+)\)', line)
        if multi_trunk_match:
            trunk_nums_str = multi_trunk_match.group(1)
            trunk_nums = re.findall(r'\d+', trunk_nums_str)
            for trunk_num_str in trunk_nums:
                trunk_num = int(trunk_num_str)
                if 1000 <= trunk_num <= 24000 and trunk_num not in trunks:
                    # Look back for the title
                    title = f"Trunk {trunk_num}"
                    for j in range(max(0, i-3), i+1):
                        check_line = lines[j].strip()
                        if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓]\s*\d+\s*—', check_line):
                            title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓]\s*\d+\s*—\s*(.+)', check_line)
                            if title_match:
                                title = title_match.group(1).strip()
                                break
                    
                    trunks[trunk_num] = {
                        'title': title,
                        'description': "",
                        'entries': [],
                        'metadata': [],
                        'cross_refs': []
                    }
        
        # Method 5: Check for patterns like "5000 series)" 
        series_match = re.search(r'(\d+)\s+series\)', line)
        if series_match:
            trunk_num = int(series_match.group(1))
            if 1000 <= trunk_num <= 24000 and trunk_num not in trunks:
                # Look back for the title
                title = f"Trunk {trunk_num}"
                for j in range(max(0, i-2), i+1):
                    check_line = lines[j].strip()
                    if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓]\s*\d+\s*—', check_line):
                        title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓]\s*\d+\s*—\s*(.+)', check_line)
                        if title_match:
                            title = title_match.group(1).strip()
                            break
                
                current_trunk = trunk_num
                trunks[trunk_num] = {
                    'title': title,
                    'description': "",
                    'entries': [],
                    'metadata': [],
                    'cross_refs': []
                }
        
        # Method 6: Check for specific patterns like "13000, distinct from Code/Syntax)"
        distinct_match = re.search(r'(\d+),\s*distinct from', line)
        if distinct_match:
            trunk_num = int(distinct_match.group(1))
            if 1000 <= trunk_num <= 24000 and trunk_num not in trunks:
                # Look back for the title
                title = f"Trunk {trunk_num}"
                for j in range(max(0, i-2), i+1):
                    check_line = lines[j].strip()
                    if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖🤔🌱]\s*\d+\s*—', check_line):
                        title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖🤔🌱]\s*\d+\s*—\s*(.+)', check_line)
                        if title_match:
                            title = title_match.group(1).strip()
                            break
                
                current_trunk = trunk_num
                trunks[trunk_num] = {
                    'title': title,
                    'description': "",
                    'entries': [],
                    'metadata': [],
                    'cross_refs': []
                }
        
        # Method 7: Direct search for specific missing trunk numbers in context
        for missing_trunk in [9000, 11000, 18000, 22000]:
            if str(missing_trunk) in line and missing_trunk not in trunks:
                # Check if this line contains the trunk number in a meaningful context
                if re.search(rf'(Original )?Trunk\s*{missing_trunk}', line) or line.strip().endswith(f'{missing_trunk})'):
                    # Look back for the title
                    title = f"Trunk {missing_trunk}"
                    for j in range(max(0, i-3), i+1):
                        check_line = lines[j].strip()
                        if re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖🤔🌱🧪🏞]\s*\d+\s*—', check_line):
                            title_match = re.search(r'[🌐🧠🤝🔤⚡🎭🔮🌊🎨🔬🏛️🌟💫🎪🎯🎲🎸🎬🎮😂🌍💻🗣📝✨🌪📺❓🦅📜🤖🤔🌱🧪🏞]\s*\d+\s*—\s*(.+)', check_line)
                            if title_match:
                                title = title_match.group(1).strip()
                                break
                    
                    current_trunk = missing_trunk
                    trunks[missing_trunk] = {
                        'title': title,
                        'description': "",
                        'entries': [],
                        'metadata': [],
                        'cross_refs': []
                    }
                    break  # Only process one trunk per line
        
        # Match entries like "- [1000/1] ← 1100 :: Hermetics"
        if line.startswith('- [') and current_trunk and current_trunk in trunks:
            entry_match = re.match(r'- \[([^\]]+)\]\s*←\s*([^:]*)::\s*(.*)', line)
            if entry_match:
                entry_id = entry_match.group(1)
                old_id = entry_match.group(2).strip()
                title = entry_match.group(3).strip()
                
                # Look ahead for description (next line starting with >)
                description = ""
                if i + 1 < len(lines) and lines[i + 1].strip().startswith('>'):
                    description = lines[i + 1].strip()[1:].strip()
                
                entry = {
                    'id': entry_id,
                    'old_id': old_id,
                    'title': title,
                    'description': description
                }
                trunks[current_trunk]['entries'].append(entry)
        
        # Capture cross-references and metadata
        elif current_trunk and current_trunk in trunks:
            if 'Cross-ref' in line:
                trunks[current_trunk]['cross_refs'].append(line.strip())
            elif line.startswith('>') and not any(line.startswith(f'> {e["description"]}') for e in trunks[current_trunk]['entries'] if e['description']):
                trunks[current_trunk]['metadata'].append(line.strip())
    
    return trunks

def generate_markdown(trunks, output_path):
    """Generate structured markdown file with extracted trunk content."""
    
    # Count categories
    categories = {}
    for trunk_num, trunk_data in trunks.items():
        category = trunk_data['title'].split('—')[0].strip() if '—' in trunk_data['title'] else 'Other'
        categories[category] = categories.get(category, 0) + 1
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Extracted Trunk Content (1000-24000)\n\n")
        f.write("## Summary\n\n")
        f.write(f"**Total Trunks Found:** {len(trunks)}\n\n")
        
        if trunks:
            f.write("**Categories:**\n")
            for category, count in sorted(categories.items()):
                f.write(f"- {category}: {count} trunk(s)\n")
            f.write("\n")
            f.write(f"**Trunk Range:** {min(trunks.keys())} - {max(trunks.keys())}\n\n")
        else:
            f.write("**No trunks found in the specified range (1000-24000)**\n\n")
        
        f.write("---\n\n")
        
        # Write each trunk
        for trunk_num in sorted(trunks.keys()):
            trunk = trunks[trunk_num]
            f.write(f"## Trunk {trunk_num} — {trunk['title']}\n\n")
            
            if trunk['description']:
                f.write(f"**Description:** {trunk['description']}\n\n")
            
            if trunk['entries']:
                f.write("**Entries:**\n\n")
                for entry in trunk['entries']:
                    f.write(f"- **[{entry['id']}]** ← {entry['old_id']} :: {entry['title']}\n")
                    if entry['description']:
                        f.write(f"  > {entry['description']}\n")
                    f.write("\n")
            
            if trunk['metadata']:
                f.write("**Metadata:**\n")
                for meta in trunk['metadata']:
                    f.write(f"- {meta}\n")
                f.write("\n")
            
            if trunk['cross_refs']:
                f.write("**Cross-References:**\n")
                for ref in trunk['cross_refs']:
                    f.write(f"- {ref}\n")
                f.write("\n")
            
            f.write("---\n\n")

def main():
    parser = argparse.ArgumentParser(
        description="Parse a text file for trunk content and output a markdown summary."
    )
    parser.add_argument(
        "--input",
        default="Uploads/Untitled 4.txt",
        help="Path to the input text file"
    )
    parser.add_argument(
        "--output",
        default="extracted_trunks_1000-24000.md",
        help="Path to save the generated markdown"
    )
    args = parser.parse_args()

    input_file = args.input
    output_file = args.output

    print("Parsing trunk content...")
    trunks = parse_trunks(input_file)

    print(f"Found {len(trunks)} trunks in range 1000-24000")

    print("Generating markdown output...")
    generate_markdown(trunks, output_file)

    print(f"Extraction complete! Output saved to: {output_file}")
    
    # Print summary
    categories = {}
    for trunk_num, trunk_data in trunks.items():
        category = trunk_data['title'].split('—')[0].strip() if '—' in trunk_data['title'] else 'Other'
        categories[category] = categories.get(category, 0) + 1
    
    print(f"\nSummary:")
    print(f"Total trunks: {len(trunks)}")
    if trunks:
        print(f"Trunk range: {min(trunks.keys())} - {max(trunks.keys())}")
        print("Categories found:")
        for category, count in sorted(categories.items()):
            print(f"  - {category}: {count}")
    else:
        print("No trunks found in range 1000-24000")

if __name__ == "__main__":
    main()
