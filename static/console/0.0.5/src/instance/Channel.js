export class Channel {
  gainNode;
  oscillatorNode;

  constructor(params) {
    this.gainNode = params.audioContext.createGain();
    this.gainNode.gain.value = params.config.gain;
    this.gainNode.connect(params.audioContext.destination);

    this.oscillatorNode = params.audioContext.createOscillator();
    this.oscillatorNode.type = params.config.type;
    this.oscillatorNode.frequency.value = null;
    this.oscillatorNode.connect(this.gainNode);

    this.oscillatorNode.start();
  }
}
