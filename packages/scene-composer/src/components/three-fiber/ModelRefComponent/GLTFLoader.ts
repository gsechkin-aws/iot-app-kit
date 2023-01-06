import { Loader, LoadingManager } from 'three';
import { useLoader } from '@react-three/fiber';

import { TwinMakerGLTFLoader } from '../../../three/GLTFLoader';
import { setupTwinMakerGLTFLoader } from '../../../three/loaderUtils';
import { URIModifier } from '../../../interfaces/interfaces';

function extensions(extendLoader?: (loader: TwinMakerGLTFLoader) => void) {
  return (loader: Loader) => {
    if (extendLoader) {
      extendLoader(loader as TwinMakerGLTFLoader);
    }
    setupTwinMakerGLTFLoader(loader as TwinMakerGLTFLoader);
  };
}

export const managers = [new LoadingManager()];
let hasSet = false;

/**
 * Extend the drei useGLTF hook to explicitly support loading manager.
 */
export function useGLTF<T extends string | string[]>(
  path: T,
  uriModifier?: URIModifier,
  extendLoader?: (loader: TwinMakerGLTFLoader) => void,
  onProgress?: (event: ProgressEvent<EventTarget>) => void,
) {
  const gltf = useLoader(
    TwinMakerGLTFLoader,
    path,
    extensions((loader) => {
      if (extendLoader) extendLoader(loader);

      if (uriModifier) {
        console.log('xxxx set managers, is old manager = ', loader.manager == managers[0])

        if (!hasSet) {

          loader.manager = managers[0];
          loader.manager.setURLModifier(uriModifier);
          hasSet = true
        } else {
          managers[1] = loader.manager;
        }

      }

      console.log('xxxx useGLTF', loader.manager.resolveURL('a/b/c.jpg'), loader)

    }),
    onProgress,
  );
  return gltf;
}

useGLTF.preload = (
  path: string | string[],
  uriModifier?: URIModifier,
  extendLoader?: (loader: TwinMakerGLTFLoader) => void,
) =>
  useLoader.preload(
    TwinMakerGLTFLoader,
    path,
    extensions((loader) => {
      if (extendLoader) extendLoader(loader);

      if (uriModifier) {
        loader.manager = managers[0];
        loader.manager.setURLModifier(uriModifier);
      }
    }),
  );

useGLTF.clear = (input: string | string[]) => useLoader.clear(TwinMakerGLTFLoader, input);
