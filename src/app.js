import './style.css'
import WebAudioLoader from 'webaudioloader'
import wavFile from './e7c48e6e7a0e12dc4a15dac76c5936dfb8314d48_recording.wav'
import { chunk } from 'lodash'

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
		const samplePacks = chunk(data, buffer.sampleRate)

		// create bits
		const bits = samplePacks.map(samplePack => {
			const lessThan02 = number => number < 0.2
			return samplePack.filter(lessThan02).length === 28126 ? 0 : 1
		})

		// create bytes
		const reverseBytes = byte => byte.reverse()
		const bytes = chunk(bits, 8).map(reverseBytes)

		// create ints
		const parsByteToInt = byte => parseInt(byte.join(''), 2)
		const ints = bytes.map(parseArrayToInt)

		// decode messsage
		const message = String.fromCharCode(...ints)

		console.log(message)
	}
})
