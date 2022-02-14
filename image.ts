export const toImage = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((r, j) => canvas.toBlob((b) => r(b), 'image/png', 1));

export const toClamped = (float: number, min: number, max: number) =>
  Math.floor(((float - min) / (max - min)) * 255);

export const createImage = async (
  data: Uint8ClampedArray,
  width: number,
  height: number
) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, width, height);

  const imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);

  const blob = await toImage(canvas);
  canvas.remove();

  const img = new Image();
  img.src = URL.createObjectURL(blob);
  img.width = width;
  img.height = height;
  return img;
};

export const boundaries = (data: Float32Array) =>
  data.reduce(
    (acc, curr) => {
      if (curr < acc[0]) {
        acc[0] = curr;
      }
      if (curr > acc[1]) {
        acc[1] = curr;
      }
      return acc;
    },
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  );

export const float2ToUint8Clamped = (data: Float32Array, scale = false) => {
  const [min, max] = scale ? boundaries(data) : [0, 1];
  const clamped = new Uint8ClampedArray(data.length * 2);
  for (let i = 0, j = 0; i < clamped.length; i++) {
    if (i % 4 === 0 || i % 4 === 1) {
      clamped[i] = toClamped(data[j++], min, max);
    } else if (i % 4 === 2) {
      clamped[i] = 0;
    } else if (i % 4 === 3) {
      clamped[i] = 255;
    }
  }
  return clamped;
};

export const float4ToUint8Clamped = (data: Float32Array, scale = false) => {
  const [min, max] = scale ? boundaries(data) : [0, 1];
  return Uint8ClampedArray.from([...data].map((v) => toClamped(v, min, max)));
};
