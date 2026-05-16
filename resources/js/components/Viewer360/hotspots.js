import * as THREE from 'three';

export const createHotspotSprite = (data, isPreview = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Wave color - institucional red with transparency
    ctx.fillStyle = isPreview ? 'rgba(255, 0, 0, 0.6)' : 'rgba(227, 5, 19, 0.4)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Inner dot
    ctx.fillStyle = isPreview ? '#ff0000' : '#e30513';
    ctx.beginPath();
    ctx.arc(32, 32, 16, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    const radius = 450;
    sprite.position.x = radius * Math.cos(data.phi) * Math.sin(data.theta);
    sprite.position.y = radius * Math.sin(data.phi);
    sprite.position.z = radius * Math.cos(data.phi) * Math.cos(data.theta);
    
    sprite.scale.set(30, 30, 1);
    sprite.userData = { isHotspot: true, data: data, isPreview };
    return sprite;
};

export const animateHotspots = (hotspotsGroup, previewSprite, time) => {
    const animateSprite = (child) => {
        const scaleBase = child.userData.isPreview ? 35 : 30;
        const scaleWave = scaleBase + Math.sin(time + (child.userData.data.id || 0)) * 6;
        child.scale.set(scaleWave, scaleWave, 1);
    };

    hotspotsGroup.children.forEach(animateSprite);
    if (previewSprite) animateSprite(previewSprite);
};
