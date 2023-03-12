import React, { useEffect, useRef, useState } from 'react';
import {
    AmbientLight,
    AxesHelper,
    BufferAttribute,
    BufferGeometry,
    Camera,
    CameraHelper,
    Clock,
    DirectionalLight,
    DirectionalLightHelper,
    Fog,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Plane,
    PlaneGeometry,
    Points,
    PointsMaterial,
    Scene,
    SphereGeometry,
    SpotLight,
    SpotLightHelper,
    Vector3,
    WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
const clock = new Clock();
function Test() {
    const elRef = useRef(null);
    const [m, setM] = useState<Mesh | null>(null);
    const addMesh = (scene: Scene) => {
        const mesh = new Mesh(
            new SphereGeometry(30, 30, 30),
            new MeshLambertMaterial({
                color: 0xcccccc
            })
        );
        mesh.name = 'obj';
        mesh.castShadow = true;
        setM(mesh);
        mesh.position.set(0, 300, 0);
        const plane = new Mesh(
            new PlaneGeometry(400, 400),
            new MeshLambertMaterial({
                color: 0xffffff
            })
        );
        plane.receiveShadow = true;
        plane.rotation.set(-Math.PI / 2, 0, 0);
        plane.position.set(0, 0, 0);

        const point = new Points(
            new BufferGeometry(),
            new PointsMaterial({
                size: 2,
                sizeAttenuation: true
            })
        );
        const arr = new Float32Array(500 * 3);
        for (let i = 0; i < 500 * 3; i++) {
            arr[i] = (Math.random() + 0.5) * 200;
        }
        point.geometry.setAttribute('position', new BufferAttribute(arr, 3));
        // point.position.set(0, 20, 0);

        scene.add(mesh, plane, point);

        scene.fog = new Fog('#262837', 1.15);
        addLight(scene, mesh, plane);
    };

    const addLight = (scene: Scene, mesh: Mesh, plane: Mesh) => {
        const light = new AmbientLight(0xeeeeee);
        scene.add(light);
        const light0 = new SpotLight(0xffffff);
        // light0.target = mesh;
        light0.castShadow = true;
        light0.angle = Math.PI / 12;
        light0.position.set(100, 100, 100);
        console.log(light0.shadow);
        light0.shadow.mapSize.set(1024, 1024);
        const help = new SpotLightHelper(light0);
        scene.add(help);
        scene.add(light0);

        // light0.shadow.camera.near = 2;
        light0.shadow.camera.far = 300;
        light0.shadow.camera.fov = 30;
        light0.shadow.radius = 10;
        scene.add(new CameraHelper(light0.shadow.camera));

        const gui = new GUI();
        const obj = {
            val: 40
        };
        scene.add(light0.target);
        gui.add(light0.target.position, 'y', -200, 400, 2).onChange((val) => {
            // light0.target.updateMatrixWorld();
            help.update();
            // plane.updateMatrix();
            // light0.updateMatrix();
            // mesh.updateMatrixWorld();
        });
    };

    const tick = (
        sphere: any,
        controls: any,
        renderer: any,
        scene: any,
        camera: any
    ) => {
        const elapsedTime = clock.getElapsedTime();
        //update sphere animate
        // 圆周运动
        sphere.position.x = Math.sin(elapsedTime);
        sphere.position.z = Math.cos(elapsedTime);
        // 触底弹跳
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) * 100;

        // Update controls
        // controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(() =>
            tick(sphere, controls, renderer, scene, camera)
        );
    };

    const animation = (
        renderer: WebGLRenderer,
        scene: Scene,
        camera: Camera
    ) => {
        requestAnimationFrame(() => animation(renderer, scene, camera));
        renderer.render(scene, camera);
    };

    useEffect(() => {
        if (!elRef.current || m) return;
        const renderer = new WebGLRenderer({
            canvas: elRef.current
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor('#262837', 1.15);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        const scene = new Scene();
        const camera = new PerspectiveCamera(
            100,
            window.innerWidth / window.innerHeight,
            0.1,
            1500
        );
        camera.position.set(10, 100, 40);
        const axis = new AxesHelper(200);
        scene.add(axis);
        const controls = new OrbitControls(camera, elRef.current);
        // controls.update();
        requestAnimationFrame(() => animation(renderer, scene, camera));
        // controls.addEventListener()
        addMesh(scene);
        // tick(scene.getObjectByName('obj'), controls, renderer, scene, camera);
        renderer.render(scene, camera);
    }, [elRef.current]);
    return (
        <div>
            <canvas ref={elRef} id="canvasEl"></canvas>
        </div>
    );
}
export default Test;
