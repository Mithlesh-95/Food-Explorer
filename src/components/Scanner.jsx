import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const Scanner = ({ onScanSuccess, onScanFailure }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const readerRef = useRef(null);
    const isScanningRef = useRef(true);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        const codeReader = new BrowserMultiFormatReader();
        readerRef.current = codeReader;

        const startScanning = async () => {
            if (isInitializedRef.current) return;
            isInitializedRef.current = true;

            const timeout = 10000;

            try {
                setIsLoading(true);
                setError(null);

                await new Promise(resolve => setTimeout(resolve, 300));
                if (!isMounted) return;

                const constraints = {
                    video: {
                        facingMode: "environment",
                        width: { min: 640, ideal: 1280 },
                        height: { min: 480, ideal: 720 }
                    }
                };

                const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Camera initialization timed out.")), timeout)
                );

                const stream = await Promise.race([streamPromise, timeoutPromise]);

                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                console.log("Scanner: Camera stream active.");
                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                codeReader.decodeFromVideoElement(
                    videoRef.current,
                    (result, err) => {
                        if (result && isScanningRef.current) {
                            isScanningRef.current = false;

                            if (streamRef.current) {
                                streamRef.current.getTracks().forEach(track => track.stop());
                            }

                            onScanSuccess(result.getText());
                        }
                    }
                );

                setIsLoading(false);
            } catch (err) {
                console.warn("Scanner initialization issue: ", err);
                if (!isMounted) return;

                if (err.name === 'NotAllowedError' || err.message?.includes("permission")) {
                    setError("Camera permission denied. Please allow access.");
                } else {
                    setError(err.message || "Could not access camera.");
                }
                setIsLoading(false);
                if (onScanFailure) onScanFailure(err.message);
            }
        };

        startScanning();

        return () => {
            console.log("Scanner: Cleanup triggered.");
            isMounted = false;
            isScanningRef.current = false;
            isInitializedRef.current = false;

            if (readerRef.current) {
                readerRef.current.reset();
                readerRef.current = null;
            }

            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });
                streamRef.current = null;
            }

            if (videoRef.current) {
                const video = videoRef.current;
                video.pause();
                video.srcObject = null;
            }
        };
    }, [onScanSuccess, onScanFailure]);

    return (
        <div className="w-full relative bg-surface-container-high rounded-2xl overflow-hidden min-h-[300px] shadow-inner border-2 border-primary/10">
            <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl shadow-2xl transition-opacity duration-700"
                muted
                playsInline
                autoPlay
            />

            {isLoading && !error && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-container-high/90 backdrop-blur-sm p-6 text-center animate-fade-in text-on-surface">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary animate-spin">refresh</span>
                    </div>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Waking up Scanner...</p>
                    <p className="text-[10px] mt-2 opacity-60">Please allow camera access</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-50 p-8 text-center animate-fade-in border-4 border-red-100">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <span className="material-symbols-outlined">no_photography</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg text-red-900 mb-2">Camera Issue</h4>
                    <p className="text-xs text-red-800 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 border-2 border-white/50 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -m-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -m-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -m-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -m-1"></div>
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_#22c55e] animate-scan-line"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;
