import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import './canvasStyle.css';

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [textInput, setTextInput] = useState('');

  
  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current);

    
    fabricCanvas.current.on('object:moving', (e) => {
      const obj = e.target;
      if (obj.left < 0) obj.left = 0;
      if (obj.top < 0) obj.top = 0;
      if (obj.left + obj.width * obj.scaleX > fabricCanvas.current.width) {
        obj.left = fabricCanvas.current.width - obj.width * obj.scaleX;
      }
      if (obj.top + obj.height * obj.scaleY > fabricCanvas.current.height) {
        obj.top = fabricCanvas.current.height - obj.height * obj.scaleY;
      }
    });

    fabricCanvas.current.on('object:scaling', (e) => {
      const obj = e.target;
      if (obj.left < 0) obj.left = 0;
      if (obj.top < 0) obj.top = 0;
      if (obj.left + obj.width * obj.scaleX > fabricCanvas.current.width) {
        obj.left = fabricCanvas.current.width - obj.width * obj.scaleX;
      }
      if (obj.top + obj.height * obj.scaleY > fabricCanvas.current.height) {
        obj.top = fabricCanvas.current.height - obj.height * obj.scaleY;
      }
    });

    
    return () => {
      fabricCanvas.current.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  const handleAddImage = (e) => {
    let imgObj = e.target.files[0];
    let render = new FileReader();
    render.readAsDataURL(imgObj);
    render.onload = (event) => {
      let imageUrl = event.target.result;
      let imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.onload = function () {
        let image = new fabric.Image(imageElement);
        fabricCanvas.current.add(image);
        fabricCanvas.current.centerObject(image);
        fabricCanvas.current.setActiveObject(image);
        fabricCanvas.current.renderAll();
      };
    };
  };

  // Enable free drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    fabricCanvas.current.isDrawingMode = !fabricCanvas.current.isDrawingMode;
  };
  // Add a circle
  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 2,
      radius: 50,
    });
    fabricCanvas.current.add(circle);
  };

  // Add a square
  const addSquare = () => {
    const square = new fabric.Rect({
      left: 150,
      top: 150,
      fill: 'transparent',
      stroke: 'green',
      strokeWidth: 2,
      width: 100,
      height: 100,
    });
    fabricCanvas.current.add(square);
  };

  // Add a triangle
  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      left: 300,
      top: 200,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 2,
      width: 100,
      height: 100,
    });
    fabricCanvas.current.add(triangle);
  };

  // Add text to the canvas
  const addText = () => {
    const text = new fabric.Text(textInput, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: 'black',
    });
    fabricCanvas.current.add(text);
    setTextInput(''); 
  };

  // Download the canvas as an image
  const downloadCanvas = () => {
    const dataURL = fabricCanvas.current.toDataURL({
      format: 'png',
      quality: 1,
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png'; 
    link.click();
  };

  return (
    <div className='contain'>
      <div style={{ margin: '20px 0' }}>
        <input
          type="file"
          accept="image/*"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleAddImage}
        />
        <label
          htmlFor="file-input"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#2c3e50',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'absolute',
            top: '75%',
            left: '5%',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid transparent',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#34495e';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#2c3e50';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
        >
          Add Image
        </label>
       
      </div>
      <div style={{position:'sticky',top:'15px'}}>
        <input
          className='inputfield'
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text"
          style={{ marginLeft: '10px', padding: '8px' }}
        />
        
        <button onClick={addText} className='btn' style={{ marginLeft: '10px' }}>
          Add Text
        </button>
        <button onClick={toggleDrawingMode} className='btn' style={{ marginLeft: '20px' }}>
          {isDrawingMode ? 'Disable Drawing' : 'Enable Drawing'}
        </button>
        <button onClick={addSquare} className='btn' style={{ marginLeft: '10px' }}>
          Add Square
        </button>
        <button onClick={addCircle} className='btn' style={{ marginLeft: '10px' }}>
          Add Circle
        </button>
        <button onClick={addTriangle} className='btn' style={{ marginLeft: '10px' }}>
          Add Triangle
        </button>
        
        <button onClick={downloadCanvas} className='btn' style={{ marginLeft: '10px' }}>
          Download Canvas
        </button>
        </div>

      <div className='container'>
        <div>
          <canvas
            width='900px'
            height='450px'
            ref={canvasRef}
            
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
