from RealtimeSTT import AudioToTextRecorder

def process_text(text):
    print(text)

if __name__ == '__main__':
    print("Wait until it says 'speak now'")
    recorder = AudioToTextRecorder(enable_realtime_transcription = True, model='base')

    while True:
        recorder.text(process_text)