import express from 'express'
import cors from 'cors'
import { interval, take, tap } from 'rxjs'

/**
 * Impossible Angular
 * Node Examples
 * Author: Sergii Lutchyn
 *
 * Server-Sent Event implementation
 *
 * Usage: npm run event-stream
 *
 * in Client use next functions:
 *
 *     stream?: Subscription
 *     getStream() {
 *         this.stream = this.getStreamData().subscribe({
 *             next: data => console.log(data),
 *             complete: () => console.log('complete')
 *         })
 *     }
 *     stopStream() {
 *         this.stream?.unsubscribe()
 *     }
 *
 *     getStreamData(): Observable<any> {
 *         return new Observable(observer => {
 *             // Create the EventSource connection
 *             const eventSource = new EventSource('http://localhost:3000/stream-data')
 *
 *             // Listen for the 'message' event (the default event type)
 *             eventSource.onmessage = (event) => {
 *                 observer.next(JSON.parse(event.data))
 *             }
 *
 *             // Handle errors
 *             eventSource.onerror = (error) => {
 *                 console.error('EventSource failed:', error)
 *                 observer.error(error)
 *                 eventSource.close()
 *             }
 *
 *             // stream-end event
 *             eventSource.addEventListener('streamend', () => {
 *                 console.log('Client received stream-end signal.')
 *                 observer.complete() // Notify the Observable that the stream is done
 *                 eventSource.close() // Manually close the EventSource connection
 *             })
 *
 *             // Return an unsubscribe function to close the connection
 *             return () => {
 *                 eventSource.close()
 *                 console.log('SSE Connection closed.')
 *             }
 *         })
 *     }
 *
 */

const app = express()

app.use(cors({
    origin: 'http://localhost:4200'
}))

// Format the data according to the SSE standard: "data: [payload]\n\n"
const sseEvent = (counter: number) => {
    const data = {
        id: counter,
        timestamp: new Date().toLocaleTimeString(),
        message: `Event stream count: ${counter}`
    }
    return `data: ${JSON.stringify(data)}\n\n`
}

app.get('/stream-data', (req, res) => {
    // 1. Set the necessary headers for SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', // Crucial for SSE
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    const streamSubs = interval(1000).pipe(
        take(15),
        tap(counter => res.write(sseEvent(counter)))
    ).subscribe({
        complete: () => {
            // Create a stream-complete event for the client to properly end the stream.
            const endEvent = 'event: streamend\ndata: Stream complete\n\n'
            res.write(endEvent)
            console.log('Server complete a stream.')
            res.end() // Close the connection
        }
    })

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected. Stopping stream.')
        streamSubs.unsubscribe() // Stop the interval
        res.end() // Close the response
    })
})

app.listen(3000, () => {
    console.log('Server running on port', 3000)
})
