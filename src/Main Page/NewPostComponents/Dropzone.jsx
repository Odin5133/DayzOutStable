import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function MyDropzone({ dataURL, setDataURL }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        setDataURL(binaryStr);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, acceptedFiles, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  const selectedFile = acceptedFiles[0];

  return (
    <div className="max-w-screen-sm mx-auto w-full">
      <div className="rounded flex  justify-center items-center overflow-hidden border-dashed border-2 border-pseudobackground2">
        {dataURL ? (
          <div className="relative">
            <img src={dataURL} className=" w-full block rounded" />
            <div className="absolute inset-0 flex justify-end items-end p-2 bg-opacity-90 bg-white ">
              <button
                onClick={() => setDataURL(null)}
                className="rounded border border-transparent font-body text-xl cursor-pointer transition duration-250  px-4 bg-pseudobackground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full cursor-pointer" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className=""></div>
            ) : (
              <div className=" w-full h-40 flex justify-center items-center transition duration-300">
                Drop your files here or click to browse
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
