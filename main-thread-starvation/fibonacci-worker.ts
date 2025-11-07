import { parentPort, workerData } from 'node:worker_threads'
import { fibonacci } from './fibonacci.ts'


const result = fibonacci(workerData)
parentPort?.postMessage(result)