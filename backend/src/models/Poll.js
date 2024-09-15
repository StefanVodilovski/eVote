class Poll {
    constructor(address, name, durationInMinutes) {
        const now = new Date();
        this.address = address
        this.name = name;
        this.duration = durationInMinutes;
        this.time = now
    }

    getName() {
        return this.name
    }

    getDuration() {
        return this.duration
    }
    getUserAddress() {
        return this.address
    }
    getTime() {
        return this.time
    }
}

module.exports = Poll;