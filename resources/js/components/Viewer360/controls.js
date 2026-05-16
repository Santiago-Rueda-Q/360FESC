import * as THREE from 'three';

export const setupControls = (bridge) => {
    // Access helpers to keep the code clean
    const { state, camera, raycaster, mouse, hotspotsGroup, sphere, props, emit } = bridge;

    const onPointerDown = (event) => {
        if (event.isPrimary === false) return;
        
        // Raycasting for hotspots
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(hotspotsGroup.children, true);
        
        const clickedHotspot = intersects.find(i => i.object.userData.isHotspot);
        if (clickedHotspot) {
            emit('hotspot-click', clickedHotspot.object.userData.data);
            return;
        }

        state.isUserInteracting = true;
        state.onPointerDownMouseX = event.clientX;
        state.onPointerDownMouseY = event.clientY;
        state.onPointerDownLon = state.lon;
        state.onPointerDownLat = state.lat;

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (event) => {
        if (event.isPrimary === false) return;
        state.lon = (state.onPointerDownMouseX - event.clientX) * 0.1 + state.onPointerDownLon;
        state.lat = (event.clientY - state.onPointerDownMouseY) * 0.1 + state.onPointerDownLat;
    };

    const onPointerUp = (event) => {
        if (event.isPrimary === false) return;
        
        if (props.editMode && 
            Math.abs(event.clientX - state.onPointerDownMouseX) < 5 && 
            Math.abs(event.clientY - state.onPointerDownMouseY) < 5) {
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            
            const intersects = raycaster.intersectObject(sphere);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const pTheta = Math.atan2(point.x, point.z);
                const pPhi = Math.asin(point.y / 500);
                emit('add-hotspot', { theta: pTheta, phi: pPhi });
            }
        }

        state.isUserInteracting = false;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
    };

    const onDocumentMouseWheel = (event) => {
        const fov = camera.fov + event.deltaY * 0.05;
        camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        camera.updateProjectionMatrix();
    };

    return {
        onPointerDown,
        onDocumentMouseWheel
    };
};
