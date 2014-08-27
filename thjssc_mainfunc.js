/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Main class for scene. Incapsulates basic functions of our task
 * @param {integer} inp_viewportW - width of threejs canvas
 * @param {integer} inp_viewportH - height of threejs canvas
 * @param {string} inp_WEBglDivId - id of div where we add canvas for painting threejs scene
 * @returns {myWebglScene}
 */
function myWebglScene(inp_viewportW, inp_viewportH, inp_WEBglDivId) {
    this.viewportW = inp_viewportW;
    this.viewportH = inp_viewportH;
    this.WEBglDivId = inp_WEBglDivId;
    var renderer; 
    var scene; var yobacamera; var clock; var stats;
    this.initScene = function() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xEEAAFF);
        if ((this.viewportW>=20)&&(this.viewportH>=20)) {
            renderer.setSize(this.viewportW-20, this.viewportH-20); 
        } else {
            renderer.setSize(this.viewportW, this.viewportH); 
        }
        //document.body.appendChild(renderer.domElement); 
        document.getElementById(this.WEBglDivId).appendChild(renderer.domElement);
        scene = new THREE.Scene;
        clock = new THREE.Clock;
    }
    this.initMainCamera = function() {
        yobacamera = new THREE.PerspectiveCamera(45, this.viewportW / this.viewportH, 0.1, 10000);
        /*camera.position.y = 160;
        camera.position.z = 400;*/
        scene.add(yobacamera);
    }
    /**
     * @param {THREE.VECTOR3} i_pos
     * @returns {undefined}
     */
    this.setMainCameraPosition = function(i_pos) {
        yobacamera.position = i_pos;
    }
    this.getMainCameraPosition =function() {
        return yobacamera.position;
    }
    this.initStats= function () {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("statsoutput").appendChild(stats.domElement);
        //return stats;
    }
    
    this.sampleScene = function() {
                var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
        var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial); 
        cube.rotation.y = Math.PI * 45 / 180;
        scene.add(cube);
        
        var pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0, 300, 200); 
        scene.add(pointLight);
        
        yobacamera.lookAt(cube.position);
        console.log(scene);
    }
    
    this.getCamera = function() {
        return yobacamera;
    }
    this.getScene = function() {
        return scene;
    }
    this.getStat = function () {
        return stats;
    }
    this.getR = function () {
        return renderer;
    }
    function render() {
     
        /*if (controls.autoRotate == true) {
            var tmp = clock.getDelta();
         cube.rotation.y -= tmp*controls.rotationSpeed; 
        }*/
           stats.update();
        renderer.render(scene, yobacamera);
        requestAnimationFrame(render);
        
    }
    this.initScene();
    this.initStats();
    this.initMainCamera();
    this.sampleScene();
    render();
}

