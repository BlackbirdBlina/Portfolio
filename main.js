// Menu

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// Animação Cubo 3D (Three.JS)

initCube();
initPiramide();

function initCube() {

    // CONTAINER HTML
    const container = document.getElementById("cube-container");
    if (!container) return;

    // Cena
    const scene = new THREE.Scene();

    // 2.3 CÂMERA
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // 2.4 RENDERER
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);

    // 2.5 LUZ
    const light = new THREE.PointLight(0xff0000, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 2.6 MATERIAIS (PRETO + VERMELHO COM EMISSIVE)
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x220000, emissiveIntensity: 0.4 }),
        new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000, emissiveIntensity: 0.4 })
    ];

    const blurMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.BackSide
    });


    // 2.7 GRUPO DO CUBO (ESSENCIAL PARA ROTAÇÃO)
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // 2.8 CUBO FRAGMENTADO (VOXELS)
    const divisions = 3;
    const cubeSize = 1.5;
    const spacing = cubeSize / divisions;
    const smallCubes = [];

    for (let x = 0; x < divisions; x++) {
        for (let y = 0; y < divisions; y++) {
            for (let z = 0; z < divisions; z++) {

                const geometry = new THREE.BoxGeometry(spacing, spacing, spacing);
                const material = materials[(x + y + z) % materials.length];

                const smallCube = new THREE.Mesh(geometry, material);

                const posX = (x - 1) * spacing;
                const posY = (y - 1) * spacing;
                const posZ = (z - 1) * spacing;

                smallCube.position.set(posX, posY, posZ);

                // Guarda posições
                smallCube.userData.initialPosition = smallCube.position.clone();
                smallCube.userData.explodedPosition = smallCube.position.clone().multiplyScalar(2.2);

                // HALO BLUR
                const blurMesh = new THREE.Mesh(geometry, blurMaterial);
                blurMesh.scale.multiplyScalar(1.25);
                smallCube.add(blurMesh);


                cubeGroup.add(smallCube);
                smallCubes.push(smallCube);
            }
        }
    }

    // 2.9 INTERAÇÃO COM O MOUSE (RAYCAST)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;

    renderer.domElement.addEventListener("mousemove", (event) => {
        const rect = renderer.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(smallCubes);

        isHovered = intersects.length > 0;
        renderer.domElement.style.cursor = isHovered ? "pointer" : "default";
    });

    // 2.10 ANIMAÇÃO (ROTAÇÃO CONTÍNUA + EXPANSÃO)
    const baseSpeed = 0.01;
    const hoverSpeed = 0.025;

    function animate() {
        requestAnimationFrame(animate);

        // ROTAÇÃO CONTÍNUA (SEMPRE)
        const speed = isHovered ? hoverSpeed : baseSpeed;
        cubeGroup.rotation.x += speed;
        cubeGroup.rotation.y += speed * 1.3;

        // EXPANDE / RECOMPÕE OS CUBINHOS
        smallCubes.forEach(cube => {
            const target = isHovered
                ? cube.userData.explodedPosition
                : cube.userData.initialPosition;

            cube.position.lerp(target, 0.06);
        });

        renderer.render(scene, camera);
    }

    animate();
}


function initPiramide() {

    // CONTAINER HTML
    const container = document.getElementById("triangle-container");
    if (!container) return;

    // Cena
    const scene = new THREE.Scene();

    // 2.3 CÂMERA
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // 2.4 RENDERER
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);

    // 2.5 LUZ
    const light = new THREE.PointLight(0xff0000, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 2.6 MATERIAIS (PRETO + VERMELHO COM EMISSIVE)
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x220000, emissiveIntensity: 0.4 }),
        new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000, emissiveIntensity: 0.4 })
    ];

    const blurMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.BackSide
    });


    // 2.7 GRUPO DO CUBO (ESSENCIAL PARA ROTAÇÃO)
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const pyramidCenter = new THREE.Vector3(0, 0, 0);

    // 2.8 PIRÂMIDE FRAGMENTADA (PIRÂMIDES TRIANGULARES)
    const divisions = 3;
    const cubeSize = 1.5;
    const spacing = cubeSize / divisions;
    const smallCubes = [];

    for (let y = 0; y < divisions; y++) {

        // Quantidade de pirâmides por lado nesta camada
        const layerSize = divisions - y;

        // Offset para centralizar a camada
        const offset = (layerSize - 1) / 2;

        for (let x = 0; x < layerSize; x++) {
            for (let z = 0; z < layerSize; z++) {

                // PIRÂMIDE TRIANGULAR (4 faces)
                const geometry = new THREE.ConeGeometry(
                    spacing * 0.6,
                    spacing,
                    4
                );

                const material = materials[(x + y + z) % materials.length];
                const smallPyramid = new THREE.Mesh(geometry, material);

                const posX = (x - offset) * spacing;
                const posY = (y - 1) * spacing;
                const posZ = (z - offset) * spacing;

                smallPyramid.position.set(posX, posY, posZ);

                // Ajuste: base apoiada corretamente
                smallPyramid.position.y += spacing / 2;

                // Guarda posições
                smallPyramid.userData.initialPosition =
                    smallPyramid.position.clone();

                const direction = smallPyramid.position.clone().sub(pyramidCenter);

                smallPyramid.userData.explodedPosition =
                    pyramidCenter.clone().add(direction.multiplyScalar(2.2));

                const blurMesh = new THREE.Mesh(geometry, blurMaterial);
                blurMesh.scale.multiplyScalar(1.25);
                smallPyramid.add(blurMesh);

                cubeGroup.add(smallPyramid);
                smallCubes.push(smallPyramid);
            }
        }
    }

    // 2.9 INTERAÇÃO COM O MOUSE (RAYCAST)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;

    renderer.domElement.addEventListener("mousemove", (event) => {
        const rect = renderer.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(smallCubes);

        isHovered = intersects.length > 0;
        renderer.domElement.style.cursor = isHovered ? "pointer" : "default";
    });

    // 2.10 ANIMAÇÃO (ROTAÇÃO CONTÍNUA + EXPANSÃO)
    const baseSpeed = 0.01;
    const hoverSpeed = 0.025;

    function animate() {
        requestAnimationFrame(animate);

        // ROTAÇÃO CONTÍNUA (SEMPRE)
        const speed = isHovered ? hoverSpeed : baseSpeed;
        cubeGroup.rotation.x += speed;
        cubeGroup.rotation.y += speed * 1.3;

        // EXPANDE / RECOMPÕE OS CUBINHOS
        smallCubes.forEach(cube => {
            const target = isHovered
                ? cube.userData.explodedPosition
                : cube.userData.initialPosition;

            cube.position.lerp(target, 0.06);
        });

        renderer.render(scene, camera);
    }

    animate();
}


