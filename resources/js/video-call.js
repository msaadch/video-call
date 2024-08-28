import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const startCallButton = document.getElementById('start-call');
    const endCallButton = document.getElementById('end-call');
    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');

    let localStream;
    let peerConnection;
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: '5dc3711485cebfd90a20',
        cluster: 'ap1',
        forceTLS: true
    });

    window.Echo.channel('video-call-channel')
        .listen('.signal', (event) => {
            handleSignal(event.signalData);
        });

    // Listen for signals from other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'signal') {
            const signalData = JSON.parse(event.newValue);
            if (signalData) {
                handleSignal(signalData);
            }
        }
    });

    async function startCall() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;

            if (!peerConnection) {
                peerConnection = new RTCPeerConnection(configuration);

                localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

                peerConnection.ontrack = (event) => {
                    if (remoteVideo.srcObject !== event.streams[0]) {
                        remoteVideo.srcObject = event.streams[0];
                    }
                };

                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendSignal({
                            type: 'ice-candidate',
                            candidate: event.candidate
                        });
                    }
                };

                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);

                sendSignal({ type: 'offer', offer: peerConnection.localDescription });
            }
        } catch (error) {
            console.error('Error starting call:', error);
        }
    }

    async function handleSignal(signalData) {
        try {
            if (signalData.type === 'offer') {
                if (!peerConnection) {
                    peerConnection = new RTCPeerConnection(configuration);

                    peerConnection.ontrack = (event) => {
                        if (remoteVideo.srcObject !== event.streams[0]) {
                            remoteVideo.srcObject = event.streams[0];
                        }
                    };

                    peerConnection.onicecandidate = (event) => {
                        if (event.candidate) {
                            sendSignal({
                                type: 'ice-candidate',
                                candidate: event.candidate
                            });
                        }
                    };
                }

                await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.offer));

                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                sendSignal({ type: 'answer', answer: peerConnection.localDescription });
            } else if (signalData.type === 'answer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.answer));
            } else if (signalData.type === 'ice-candidate') {
                await peerConnection.addIceCandidate(new RTCIceCandidate(signalData.candidate));
            }
        } catch (error) {
            console.error('Error handling signal:', error);
        }
    }

    async function endCall() {
        try {
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            localVideo.srcObject = null;
            remoteVideo.srcObject = null;
        } catch (error) {
            console.error('Error ending call:', error);
        }
    }

    function sendSignal(signal) {
        axios.post('/send-signal', signal)
            .then(response => {
                console.log(response.data);

                // Broadcast to other tabs
                localStorage.setItem('signal', JSON.stringify(signal));
            })
            .catch(error => console.error('Error sending signal:', error));
    }

    startCallButton.addEventListener('click', startCall);
    endCallButton.addEventListener('click', endCall);
});
