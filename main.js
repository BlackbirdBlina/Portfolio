// Menu

const menu = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
}

window.onscroll = () => {
    menu.classList.remove("bx-x");
    navbar.classList.remove("active");
}

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

const typed = new Typed('.multiple-text', {
    strings: ["Desenvolvedora Fronted", "Web Designer", "Desenvolvedora Backend"],
    typeSpeed: 80,
    baackSpeed: 80,
    backDelay: 1200,
    loop: true,
});

// Animação Cubo 3D (Three.JS)

initCube();
initPiramide();
initGears();

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
    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 2.6 MATERIAIS (PRETO + VERMELHO COM EMISSIVE)
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x220000, emissiveIntensity: 0.4 }),
        new THREE.MeshStandardMaterial({ color: 0x98302e, emissive: 0x1D0200, emissiveIntensity: 0.4 })
    ];

    const blurMaterial = new THREE.MeshBasicMaterial({
        color: 0x98302e,
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
    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 2.6 MATERIAIS (PRETO + VERMELHO COM EMISSIVE)
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x220000, emissiveIntensity: 0.4 }),
        new THREE.MeshStandardMaterial({ color: 0x98302e, emissive: 0x1D0200, emissiveIntensity: 0.4 })
    ];

    const blurMaterial = new THREE.MeshBasicMaterial({
        color: 0x98302e,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.BackSide
    });


    // 2.7 GRUPO DA PIRÂMIDE (ESSENCIAL PARA ROTAÇÃO)
    const pyramidGroup = new THREE.Group();
    scene.add(pyramidGroup);

    const pyramidCenter = new THREE.Vector3(0, 0, 0);

    // 2.8 PIRÂMIDE FRAGMENTADA (PIRÂMIDES TRIANGULARES)
    const divisions = 3;
    const pyramidSize = 1.5;
    const spacing = pyramidSize / divisions;
    const smallPyramids = [];

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

                pyramidGroup.add(smallPyramid);
                smallPyramids.push(smallPyramid);
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
        const intersects = raycaster.intersectObjects(smallPyramids);

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
        pyramidGroup.rotation.y += speed * 1.3;

        // EXPANDE / RECOMPÕE AS PIRAMIDEZINHAS
        smallPyramids.forEach(pyramid => {
            const target = isHovered
                ? pyramid.userData.explodedPosition
                : pyramid.userData.initialPosition;

            pyramid.position.lerp(target, 0.06);
        });

        renderer.render(scene, camera);
    }

    animate();
}


function initGears() {

    const container = document.getElementById("gear-container");
    if (!container || !window.THREE) return;

    // CENA
    const scene = new THREE.Scene();

    // CÂMERA
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 7;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // LUZ
    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    // GRUPO PRINCIPAL
    const gearGroup = new THREE.Group();
    scene.add(gearGroup);

    // MATERIAL
    const gearMaterial = new THREE.MeshStandardMaterial({
        color: 0x98302e,
        emissive: 0x1D0200,
        emissiveIntensity: 0.4,
    });

    const blurMaterial = new THREE.MeshBasicMaterial({
        color: 0x98302e,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.BackSide
    });


    // FUNÇÃO DE ENGRENAGEM
    function createGear({
        radius,
        thickness,
        teeth,
        toothWidth,
        toothHeight
    }) {
        const gear = new THREE.Group();

        // CORPO COM FURO

        const outerRadius = radius;
        const innerRadius = radius * 0.60; // controla o tamanho do furo

        const bodyGeometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            48
        );

        const body = new THREE.Mesh(bodyGeometry, gearMaterial);

        const blurMesh = new THREE.Mesh(bodyGeometry, blurMaterial);
        blurMesh.scale.multiplyScalar(1.25);
        body.add(blurMesh);

        // body.rotation.x = Math.PI / 2;
        gear.add(body);

        // DENTES
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;

            const toothGeometry = new THREE.BoxGeometry(
                toothWidth,
                toothHeight,
                thickness
            );

            const tooth = new THREE.Mesh(toothGeometry, gearMaterial);

            const distance = outerRadius + toothHeight / 2;

            tooth.position.set(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            );

            const blurMesh = new THREE.Mesh(toothGeometry, blurMaterial);
            blurMesh.scale.multiplyScalar(1.25);
            tooth.add(blurMesh);
            tooth.rotation.z = angle;
            gear.add(tooth);
        }

        return gear;
    }


    // CONFIGURAÇÃO
    const gears = [];

    const gearConfig = [
        { x:  0,   y:  0,   size: 1.2, teeth: Math.round(1.2 * 6), dir:  1 },
        { x: -2.2, y:  1.5, size: 0.6, teeth: Math.round(0.6 * 12), dir: -1 },
        { x:  2.2, y:  1.5, size: 0.6, teeth: Math.round(0.6 * 12), dir:  1 },
        { x: -2.2, y: -1.5, size: 0.5, teeth: Math.round(0.6 * 12), dir:  1 },
        { x:  2.2, y: -1.5, size: 0.5, teeth: Math.round(0.6 * 12), dir: -1 }
    ];

    gearConfig.forEach(cfg => {

        const gear = createGear({
            radius: cfg.size,
            thickness: 0.35,
            teeth: cfg.teeth,
            toothWidth: cfg.size * 0.3,
            toothHeight: cfg.size * 0.4
        });

        gear.position.set(cfg.x, cfg.y, 0);

        gear.userData = {
            initialPosition: gear.position.clone(),
            explodedPosition: gear.position.clone().multiplyScalar(1.7),
            rotationDir: cfg.dir,
            rotationSpeed: 0.01 + Math.random() * 0.008
        };

        gears.push(gear);
        gearGroup.add(gear);
    });

    // INTERAÇÃO
    let isHovered = false;

    container.addEventListener("mouseenter", () => {
        isHovered = true;
        container.style.cursor = "pointer";
    });

    container.addEventListener("mouseleave", () => {
        isHovered = false;
        container.style.cursor = "default";
    });

    // RESIZE
    window.addEventListener("resize", () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // ANIMAÇÃO
    function animate() {
        requestAnimationFrame(animate);

        gears.forEach(gear => {

            // Rotação contínua
            gear.rotation.z -=
                gear.userData.rotationSpeed *
                gear.userData.rotationDir;

            // Espalhar / juntar
            const target = isHovered
                ? gear.userData.explodedPosition
                : gear.userData.initialPosition;

            gear.position.lerp(target, 0.06);
        });

        renderer.render(scene, camera);
    }

    animate();
}
