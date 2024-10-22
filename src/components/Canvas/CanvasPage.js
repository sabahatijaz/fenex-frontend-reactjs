import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import './canvasStyle.css';

const CanvasPage = ({ uploadedImage }) => {
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

  useEffect(() => {
    if (uploadedImage) {
      let imageElement = document.createElement('img');
      imageElement.src = uploadedImage;
      imageElement.onload = function () {
        let image = new fabric.Image(imageElement);
        fabricCanvas.current.add(image);
        fabricCanvas.current.centerObject(image);
        fabricCanvas.current.setActiveObject(image);
        fabricCanvas.current.renderAll();
      };
    }
  }, [uploadedImage]);

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    fabricCanvas.current.isDrawingMode = !fabricCanvas.current.isDrawingMode;
  };

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
    <div className="canvas-page-container">
      <div className="toolbar">
        <input
          className="inputfield"
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text"
        />
        <button onClick={addText} className="btn">Add Text</button>
        <button onClick={toggleDrawingMode} className="btn">
          {isDrawingMode ? 'Disable Drawing' : 'Enable Drawing'}
        </button>
        <button onClick={addSquare} className="btn">Add Square</button>
        <button onClick={addCircle} className="btn">Add Circle</button>
        <button onClick={addTriangle} className="btn">Add Triangle</button>
        <button onClick={downloadCanvas} className="btn">Download Canvas</button>
      </div>

      <div className="canvas-container">
        <canvas width="900px" height="450px" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasPage;
