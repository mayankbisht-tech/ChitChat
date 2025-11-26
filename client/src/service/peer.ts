class PeerService {
    peer: RTCPeerConnection;

    constructor() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        });
    }
    async getAnswer(offer: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(ans);
            return ans;
        }
    }
    
    async setLocalDescription(ans: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(ans);
        }
    }
    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            return offer;
        }
    }
    addIceCandidate(candidate: RTCIceCandidateInit) {
        if (this.peer) {
            this.peer.addIceCandidate(candidate).catch(err => {
                console.error("Error adding ICE candidate:", err);
            });
        }
    }
    
    onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
        if (this.peer) {
            this.peer.onicecandidate = (event) => {
                if (event.candidate) {
                    callback(event.candidate);
                }
            };
        }
    }
    
    onTrack(callback: (stream: MediaStream) => void) {
        if (this.peer) {
            this.peer.ontrack = (event) => {
                callback(event.streams[0]);
            };
        }
    }
}

export default new PeerService();
