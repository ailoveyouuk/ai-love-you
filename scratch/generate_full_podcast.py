import os
import json
import base64
import urllib.request
import time

def get_api_key():
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("GOOGLE_API_KEY="):
                    return line.split("=")[1].strip()
    return None

def synthesize_text(text, voice_name, api_key):
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
    # Chirp 3 HD voices don't always support full SSML, so we use 'text' with natural punctuation
    data = {
        "input": {"text": text},
        "voice": {
            "languageCode": "en-GB",
            "name": voice_name
        },
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": 1.05
        }
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode("utf-8"))
        return base64.b64decode(result["audioContent"])

def produce_podcast():
    api_key = get_api_key()
    if not api_key:
        print("API Key not found.")
        return

    # Elite Chirp 3 HD Voices
    LEWIS = "en-GB-Chirp3-HD-Fenrir" 
    SARAH = "en-GB-Chirp3-HD-Aoede"

    # Hyper-conversational Script
    script = [
        (LEWIS, "Welcome to Edition Seven of the AI Love You Journal. I’m Lewis, y'know... coming to you from a fairly rainy Lincolnshire today."),
        (SARAH, "And I’m Sarah. It’s actually quite sunny down here in London, Lewis... for once! Today, we’re diving into something called Synthetic Nature. It’s a bit of a mind-bender, this one, isn't it?"),
        (LEWIS, "It really is. I mean, we spent the last few issues talking about 'Friction' and industrial grids, but now? It feels like we’ve traded the factory for a greenhouse. We’re literally growing the machine."),
        (SARAH, "Exactly! It’s the Symbiocene. This idea that the lab and the garden have finally... well, merged. But looking at the films in this issue, Lewis... it’s not all sunshine, is it?"),
        (LEWIS, "Oh, definitely not. I mean, take 'The Great Flood'. It’s a disaster movie on the surface, but underneath? It’s about using human grief to train AI. That’s a bit grim, y'know? Even for a tech journal."),
        (SARAH, "It’s haunting! But then you’ve got Gore Verbinski’s latest... 'Good Luck, Have Fun, Don't Die'. It’s this wild satire where the hero wants to save the world by making everyone... get this... allergic to Wi-Fi."),
        (LEWIS, "Wait, seriously? Allergic to Wi-Fi? I mean, I’ve had some bad reception in the North East, Sarah, but that’s one way to solve the screen-time problem!"),
        (SARAH, "Ha! It’s extreme, but it hits home, right? It’s about our terminal dependency on the virtual. But let’s look at something more... constructive. Sonic Ecosystems."),
        (LEWIS, "Right. Holly Herndon. She’s 'spawning' AI vocal twins. It’s like she’s growing a choir in a petri dish. And Max Cooper... PhD in computational biology. I mean, that’s a proper resume, isn't it?"),
        (SARAH, "He’s brilliant. He’s turning the Royal Albert Hall into a living sculpture of light. It’s architecture for the ears, Lewis. And speaking of architecture... have you seen 'Tree One'?"),
        (LEWIS, "Oh, the ten-metre algae tower! ecoLogicStudio are onto something there. It breathes, Sarah. It captures more carbon than twelve mature trees. That’s a tree I can get behind."),
        (SARAH, "It’s the future! And it goes right down to the tools. Teenage Engineering’s new sequencer—the OP-XY. It’s all about the haptics. That clicky, mechanical romance."),
        (LEWIS, "Absolutely. In a world of frictionless glass, having something that actually pushes back... it feels real. It’s a proper professional tool that you can actually hold. It's brilliant."),
        (SARAH, "We’re even seeing it in skin now. Electronic skin that replicates our own sensors. The boundary between the lab and our own bodies is just... well, it's gone."),
        (LEWIS, "Gone permanently, it seems. Anyway, that’s all we’ve got for Edition Seven. Thank you for listening, and look... if you have any suggestions for topics or content for future Editions, please do get in touch via lewis@ailoveyou.uk. Goodbye from a slightly less rainy Lincolnshire!"),
        (SARAH, "Goodbye!")
    ]

    output_path = "assets/audio/journal/edition-07-podcast-chirp.mp3"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "wb") as master:
        for voice, text in script:
            print(f"Synthesizing {voice}...")
            content = synthesize_text(text, voice, api_key)
            master.write(content)
            time.sleep(0.5)

    print(f"\nSUCCESS: Chirp-HD Podcast generated at {output_path}")

if __name__ == "__main__":
    produce_podcast()
