import { WriteStream } from 'node:tty'

/**
 * Represents a stream that writes to a void (null) destination
 * Useful to silence the logs from semantic-release.
 *
 */
export class VoidStream extends WriteStream {
    public write(): boolean {
        return false
    }
}

/**
 * Represents a "rescoped" stream which overrides the write stream
 * content expected to be received from semantic-release
 *
 */
export class RescopedStream extends WriteStream {
    constructor(
        private readonly stream: WriteStream & { fd: number },
        private readonly scope: string,
    ) {
        super(stream.fd)
    }

    public write(chunk: string): boolean {
        this.stream.write(chunk.replace('[semantic-release]', `[${this.scope}]`))

        return true
    }
}

