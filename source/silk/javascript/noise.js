var undef

// Pseudo-random generator
function Marsaglia(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;
  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };

  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}

Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};

// Noise functions and helpers
function PerlinNoise(seed) {
  var rnd = seed !== undef ? new Marsaglia(seed) : Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var perm = new Array(512) // Uint8Array(512);
  for(i=0;i<256;++i) { perm[i] = i; }
  for(i=0;i<256;++i) { var t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t; }
  // copy to avoid taking mod in perm[0];
  for(i=0;i<256;++i) { perm[i + 256] = perm[i]; }

  // TODO: Benchmark
  function grad3d(i,x,y,z) {
    var h = i & 15; // convert into 1   2 gradient directions
    // var u = h<8 ? x : y,
    //     v = h<4 ? y : h===12||h===14 ? x : z;
    // return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);


    // Optimization from 
    // http://riven8192.blogspot.com/2010/08/calculate-perlinnoise-twice-as-fast.html
    //
    // inline float grad(int hash, float x, float y, float z)
    //    {  
    //float u = (h < 8) ? x : y;
    //float v = (h < 4) ? y : ((h == 12 || h == 14) ? x : z);
    //return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);

    switch(h & 0xF)
    {
     case 0x0: return  x + y;
     case 0x1: return -x + y;
     case 0x2: return  x - y;
     case 0x3: return -x - y;
     case 0x4: return  x + z;
     case 0x5: return -x + z;
     case 0x6: return  x - z;
     case 0x7: return -x - z;
     case 0x8: return  y + z;
     case 0x9: return -y + z;
     case 0xA: return  y - z;
     case 0xB: return -y - z;
     case 0xC: return  y + x;
     case 0xD: return -y + z;
     case 0xE: return  y - x;
     case 0xF: return -y - z;
     default: return 0; // never happens
    }
  
  }

  function grad2d(i,x,y) {
    var v = (i & 1) === 0 ? x : y;
    return (i&2) === 0 ? -v : v;
  }

  function grad1d(i,x) {
    return (i&1) === 0 ? -x : x;
  }

  function lerp(t,a,b) { return a + t * (b - a); }

  this.noise3d = function(x, y, z) {
    //var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
    //x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var X = (x|0)&255, Y = (y|0)&255, Z = (z|0)&255;
    x -= (x|0); y -= (y|0); z -= (z|0);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
    var p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
        p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z;
    return lerp(fz,
      lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
               lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
      lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
               lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))));
  };

  this.noise2d = function(x, y) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255;
    x -= Math.floor(x); y -= Math.floor(y);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
    var p0 = perm[X]+Y, p1 = perm[X + 1] + Y;
    return lerp(fy,
      lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
      lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)));
  };

  this.noise1d = function(x) {
    var X = Math.floor(x)&255;
    x -= Math.floor(x);
    var fx = (3-2*x)*x*x;
    return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1));
  };
}

// processing defaults
// Yuriedit: window vs. var
window.noiseProfile = { generator: undef, octaves: 4, fallout: 0.5, seed: undef};

/**
* Returns the Perlin noise value at specified coordinates. Perlin noise is a random sequence
* generator producing a more natural ordered, harmonic succession of numbers compared to the
* standard random() function. It was invented by Ken Perlin in the 1980s and been used since
* in graphical applications to produce procedural textures, natural motion, shapes, terrains etc.
* The main difference to the random() function is that Perlin noise is defined in an infinite
* n-dimensional space where each pair of coordinates corresponds to a fixed semi-random value
* (fixed only for the lifespan of the program). The resulting value will always be between 0.0
* and 1.0. Processing can compute 1D, 2D and 3D noise, depending on the number of coordinates
* given. The noise value can be animated by moving through the noise space as demonstrated in
* the example above. The 2nd and 3rd dimension can also be interpreted as time.
* The actual noise is structured similar to an audio signal, in respect to the function's use
* of frequencies. Similar to the concept of harmonics in physics, perlin noise is computed over
* several octaves which are added together for the final result.
* Another way to adjust the character of the resulting sequence is the scale of the input
* coordinates. As the function works within an infinite space the value of the coordinates
* doesn't matter as such, only the distance between successive coordinates does (eg. when using
* noise() within a loop). As a general rule the smaller the difference between coordinates, the
* smoother the resulting noise sequence will be. Steps of 0.005-0.03 work best for most applications,
* but this will differ depending on use.
*
* @param {float} x          x coordinate in noise space
* @param {float} y          y coordinate in noise space
* @param {float} z          z coordinate in noise space
*
* @returns {float}
*
* @see random
* @see noiseDetail
*/

// Yuriedit
// caching
window.noiseProfile.generator = new PerlinNoise(0) //noiseProfile.seed);

window.noise = function(x, y, z, octaves, fallout) {
  
  var generator = noiseProfile.generator;
  // Yuriedit; removed the check for the pre-existence of the generator

  var effect = 1, k = 1, sum = 0;
  // Yuriedit: Pass in octaves / fallout
  for(var i=0; i< octaves; ++i) {
    effect *= fallout;
    // Yuriedit
    // switch (arguments.length) {
    // case 2:
    //   sum += effect * (1 + generator.noise1d(k*x))/2; break;
    // case 3:
    //   sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
    // case 4:
    sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2;// break;
    // }
    k *= 2;
  }
  return sum;
};

/**
* Adjusts the character and level of detail produced by the Perlin noise function.
* Similar to harmonics in physics, noise is computed over several octaves. Lower octaves
* contribute more to the output signal and as such define the overal intensity of the noise,
* whereas higher octaves create finer grained details in the noise sequence. By default,
* noise is computed over 4 octaves with each octave contributing exactly half than its
* predecessor, starting at 50% strength for the 1st octave. This falloff amount can be
* changed by adding an additional function parameter. Eg. a falloff factor of 0.75 means
* each octave will now have 75% impact (25% less) of the previous lower octave. Any value
* between 0.0 and 1.0 is valid, however note that values greater than 0.5 might result in
* greater than 1.0 values returned by noise(). By changing these parameters, the signal
* created by the noise() function can be adapted to fit very specific needs and characteristics.
*
* @param {int} octaves          number of octaves to be used by the noise() function
* @param {float} falloff        falloff factor for each octave
*
* @see noise
*/
window.noiseDetail = function(octaves, fallout) {
  noiseProfile.octaves = octaves;
  if(fallout !== undef) {
    noiseProfile.fallout = fallout;
  }
};

/**
* Sets the seed value for noise(). By default, noise() produces different results each
* time the program is run. Set the value parameter to a constant to return the same
* pseudo-random numbers each time the software is run.
*
* @param {int} seed         int
*
* @returns {float}
*
* @see random
* @see radomSeed
* @see noise
* @see noiseDetail
*/
window.noiseSeed = function(seed) {
  noiseProfile.seed = seed;
  noiseProfile.generator = undef;
};
