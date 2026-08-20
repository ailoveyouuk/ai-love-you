import os
import json
import base64
import urllib.request
import time

def generate_audio():
    # Configuration
    parts = ["part1", "part2", "part3", "part4"]
    output_dir = "assets/audio/journal"
    final_output = os.path.join(output_dir, "edition-07-podcast.mp3")
    
    # Load API Key from .env
    api_key = None
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("GOOGLE_API_KEY="):
                    api_key = line.split("=")[1].strip()
    
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in .env file.")
        return

    os.makedirs(output_dir, exist_ok=True)
    all_audio_content = []

    for part in parts:
        ssml_path = f"assets/audio/narration_script_{part}.ssml"
        if not os.path.exists(ssml_path):
            print(f"Skipping {part} as file not found.")
            continue
            
        print(f"Synthesizing {part}...")
        
        with open(ssml_path, "r") as f:
            ssml_content = f.read()

        url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
        data = {
            "input": {"ssml": ssml_content},
            "voice": {
                "languageCode": "en-GB",
                "name": "en-GB-Neural2-B" 
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "pitch": -1.5,
                "speakingRate": 0.98
            }
        }

        req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode("utf-8"))
                all_audio_content.append(base64.b64decode(result["audioContent"]))
                # Respect rate limits
                time.sleep(1)
        except Exception as e:
            print(f"Error calling Google Cloud TTS for {part}: {e}")

    if all_audio_content:
        with open(final_output, "wb") as out:
            for content in all_audio_content:
                out.write(content)
        print(f"\nSUCCESS: High-resolution podcast generated at: {final_output}")
        print(f"Total parts stitched: {len(all_audio_content)}")
    else:
        print("No audio content generated.")

if __name__ == "__main__":
    generate_audio()
