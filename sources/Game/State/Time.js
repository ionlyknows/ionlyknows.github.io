export default class Time
{
    /**
     * Constructor
     */
    constructor()
    {
        this.start = performance.now() / 1000 // sub-millisecond (Date.now() made 16/17 ms deltas jitter)
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 / 1000
    }

    /**
     * Tick
     */
    update()
    {
        const current = performance.now() / 1000

        this.delta = current - this.current
        this.elapsed += this.delta
        this.current = current

        if(this.delta > 60 / 1000)
        {
            this.delta = 60 / 1000
        }
    }
}