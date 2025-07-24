// import React, { useRef, useState } from 'react';

// function App() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedFile, setRecordedFile] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
//         setRecordedFile(file);

//         // ✅ Print blob info here
//         console.log('🟢 Audio Blob:', blob);
//         console.log('Size:', blob.size, 'bytes');
//         console.log('Type:', blob.type);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing mic:', error);
//       alert('Microphone access denied or error occurred.');
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>🎤 Simple Voice Recorder</h2>
//       <p>Status: <strong>{isRecording ? 'Recording...' : 'Not Recording'}</strong></p>

//       {!isRecording ? (
//         <button onClick={startRecording} style={styles.button}>Start Recording</button>
//       ) : (
//         <button onClick={stopRecording} style={styles.button}>Stop Recording</button>
//       )}

//       {recordedFile && (
//         <div style={{ marginTop: '1rem' }}>
//           <p>🎧 Audio file is ready</p>
//           <audio controls src={URL.createObjectURL(recordedFile)} />
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: '2rem',
//     textAlign: 'center',
//     fontFamily: 'Arial',
//   },
//   button: {
//     padding: '1rem 2rem',
//     fontSize: '1rem',
//     backgroundColor: '#4caf50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//   }
// };

// export default App;







import React, { useRef, useState } from 'react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setRecordedFile(file);

        // ✅ Log info
        console.log('🟢 Audio Blob:', blob);
        console.log('Size:', blob.size, 'bytes');
        console.log('Type:', blob.type);

        // ✅ Send to server
        sendRecordingToServer(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing mic:', error);
      alert('Microphone access denied or error occurred.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendRecordingToServer = async (blob) => {
    try {
      const base64Audio = await blobToBase64(blob);
      const response = await fetch('https://vakeel-frontend.onrender.com/recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          name: 'recording.webm',
        }),
      });

      const data = await response.json();
      console.log('✅ Server response:', data);
    } catch (error) {
      console.error('❌ Error sending recording to server:', error);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div style={styles.container}>
      <h2>🎤 Simple Voice Recorder</h2>
      <p>Status: <strong>{isRecording ? 'Recording...' : 'Not Recording'}</strong></p>

      {!isRecording ? (
        <button onClick={startRecording} style={styles.button}>Start Recording</button>
      ) : (
        <button onClick={stopRecording} style={styles.button}>Stop Recording</button>
      )}

      {recordedFile && (
        <div style={{ marginTop: '1rem' }}>
          <p>🎧 Audio file is ready</p>
          <audio controls src={URL.createObjectURL(recordedFile)} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default App;
