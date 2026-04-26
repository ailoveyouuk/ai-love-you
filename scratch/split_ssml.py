import os

def create_ssml_parts():
    text_path = "assets/audio/edition-07-text.txt"
    with open(text_path, "r") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    # Define sections
    parts = []
    current_part = []
    
    char_count = 0
    part_idx = 1
    
    # Split points based on headings
    split_headings = ["[II. Music]", "[IV. Products]", "[VI. Innovation]"]
    
    header = "<speak>\n"
    footer = "\n</speak>"
    
    current_part.append("<s>Welcome to Edition Seven of the AI Love You Journal.</s>")
    current_part.append("<break time=\"800ms\"/>")
    current_part.append("<s>I’m Leo.</s>")
    current_part.append("<break time=\"500ms\"/>")
    current_part.append("<s>And I’m Sarah.</s>")
    current_part.append("<break time=\"800ms\"/>")

    for line in lines:
        # Check for split
        if any(h in line for h in split_headings) and len(current_part) > 10:
            content = header + "\n".join(current_part) + footer
            with open(f"assets/audio/narration_script_part{part_idx}.ssml", "w") as out:
                out.write(content)
            part_idx += 1
            current_part = []
        
        # Format line
        if line.startswith("[") or "Edition" in line or "Note" in line:
            current_part.append(f"<p><emphasis level=\"moderate\">{line}</emphasis></p>")
            current_part.append("<break time=\"600ms\"/>")
        elif len(line) < 50 and (line.isupper() or ":" in line):
            current_part.append(f"<h2>{line}</h2>")
            current_part.append("<break time=\"400ms\"/>")
        else:
            # Pacing for Teenage Engineering
            if "Teenage Engineering" in line or "OP-XY" in line:
                current_part.append(f"<prosody rate=\"slow\"><s>{line}</s></prosody>")
            else:
                current_part.append(f"<s>{line}</s>")
            current_part.append("<break time=\"300ms\"/>")

    # Last part
    current_part.append("<break time=\"800ms\"/>")
    current_part.append("<s>That’s Edition Seven. Thanks for joining us.</s>")
    current_part.append("<break time=\"500ms\"/>")
    current_part.append("<s>Stay curated.</s>")
    
    content = header + "\n".join(current_part) + footer
    with open(f"assets/audio/narration_script_part{part_idx}.ssml", "w") as out:
        out.write(content)

    print(f"Generated {part_idx} SSML parts.")

if __name__ == "__main__":
    create_ssml_parts()
