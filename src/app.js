import './style.css'
import WebAudioLoader from 'webaudioloader'
import wavFile from './e7c48e6e7a0e12dc4a15dac76c5936dfb8314d48_recording.wav'

const wal = new WebAudioLoader({
	context: new AudioContext()
})

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#6e90f3'

wal.load(wavFile, {
	onload(err, buffer) {
		const data = buffer.getChannelData(0)

		// render data on canvas
		for (let i = 0; i < data.length; i+= 5) {
			ctx.fillRect(i / 2500, 100 + data[i] * 200, 0.2, 0.2)
		}

		// slice data to samplePacks
		const sampleRate = buffer.sampleRate
		const samplePacksLength = data.length / sampleRate
		const samplePacks = []

		for (let i = 0; i < samplePacksLength; i++) {
			const startSamplePosition = i * sampleRate
			const endSamplePosition = (i + 1) * sampleRate
			const sampleData = data.slice(startSamplePosition, endSamplePosition)
			samplePacks.push(sampleData)
		}

		// create bits
		const bits = samplePacks.map(samplePack => {
			const lessThan02 = samplePack.filter(sample => sample < 0.2)
			const bit = lessThan02.length === 28126 ? 0 : 1
			return bit
		})

		// create bytes
		const bytes = bits.join('').match(/.{8}/g).map(byte => {
			// reverse bytes order
			return [...byte].reverse().join('')
		})

		// create ints
		const ints = bytes.map(byte => window.parseInt(byte, 2))

		// decode messsage
		const message = String.fromCharCode(...ints)

		console.log(message)
	}
})
