import {createCompactMount} from './compact-mount.js';

// Construction-first hybrid: same illustrative trimmed receiver, separate assembly.
export const recommendedSpec={baseMM:[300,260,12.7],deckMM:[180,180,12.7],uprightMM:[80,121,12.7],clearGapMM:127,pivotAboveDeckMM:101,yawRiserMM:60,yawLimit:30,pitchMin:-10,pitchMax:25,yawDrive:'coaxial',pitchLinkages:1};
export function createRecommendedMount(scene,helpers){return createCompactMount(scene,helpers,{recommended:true});}
