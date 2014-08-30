/* 
 * Defining scene. Be careful calling these routines.
 */
    var myUnitSz=20;
    /**
     * 
     * @param {type} w - width of cube
     * @param {type} h - height
     * @param {type} d - depth
     * @param {Vector3} cntC - center of cube
     * @returns {MyCube}
     */
    function MyCube(w, h, d, cntC) {
        this.cubeWidth = w; this.cubeHeight = h; this.cubeDepth = d;
        this.centerCoord=new THREE.Vector3(); this.centerCoord.copy(cntC);
    }
    function MyPlane(w, h, lc, rt, plTex) {
        this.planeWidth = w; this.planeHeight = h;
        this.planeLocation = new THREE.Vector3(); this.planeLocation.copy(lc);
        this.planeRotationAngleDeg = rt;
        this.planeTexturePath = plTex;
    }
    function LevelStruct() {
        this.Planes=new Array();
        this.Cubes = new Array();
    }
    var myLevelStruct = new LevelStruct();
    function defBasicScene () {
        var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
        cube = new THREE.Mesh(cubeGeometry, defCrateMaterial()); 
        cube.rotation.y = Math.PI * 45 / 180;
        scene.add(cube);
            console.log(scene);
        camera.lookAt(cube.position);

       defSkyBox();

        var pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(0, 300, 200); 
        scene.add(pointLight);
    }
     function defSkyBox() {
        var skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
        var urls = ['graphon/skyboxpng/grnplsntft.png',
                    'graphon/skyboxpng/grnplsntbk.png',
                    'graphon/skyboxpng/grnplsntup.png',
                    'graphon/skyboxpng/grnplsntdn.png',
                    'graphon/skyboxpng/grnplsntrt.png',
                    'graphon/skyboxpng/grnplsntlf.png'
                ]
        // wrap it up into the object that we need
                var cubemap = THREE.ImageUtils.loadTextureCube(urls);
                // set the format, likely RGB
                // unless you've gone crazy
                cubemap.format = THREE.RGBFormat;
                var shader = THREE.ShaderLib[ "cube" ];
                shader.uniforms[ "tCube" ].value = cubemap;
        var skyboxMaterial = new THREE.ShaderMaterial( {
                  fragmentShader: shader.fragmentShader,
                  vertexShader: shader.vertexShader,
                  uniforms: shader.uniforms,
                  depthWrite: false,
                  side: THREE.BackSide
                });
        var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial); 
        skybox.rotation.x += Math.PI / 2;
        scene.add(skybox);
    }
    function defCrateMaterial() {
        var materials = [];
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/bigCrate2.png') })); // right face
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/bigCrate0.png') })); // left face
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/bigCrateTop.png') })); // top face
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/bigCrateTop.png') })); // bottom face
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/bigCrate1.png') })); // front face
                    materials.push(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('graphon/oldWood.png') })); // back face
                    var cubeMaterial = new THREE.MeshFaceMaterial(materials);
                    return cubeMaterial;
    }
    /**
     * 
     * @param {array of objects} repeatCnt - repeating of textures. Array contains 3 elements for pairs of params for cube faces:
     *  right-left rep count (y0z), top-bottom (z0x), front-back repeat param (x0y)
     * @param {type} texPath - path to graphical file to use (ToDo - make it array)
     * @returns {THREE.MeshFaceMaterial} - mapped material for cube
     */
    function defPlainMaterialCube(repeatCnt, texPath) {
        /*var plainTexture = THREE.ImageUtils.loadTexture(texPath);
            plainTexture.wrapS = plainTexture.wrapT = THREE.RepeatWrapping;
            plainTexture.repeat.set( repeatCnt.rpt1, repeatCnt.rpt2 ); */
        var materials=[];
        for (var i=0; i<6; i++) {
           var plainTexture = THREE.ImageUtils.loadTexture(texPath);
            plainTexture.wrapS = plainTexture.wrapT = THREE.RepeatWrapping;
            plainTexture.repeat.set( repeatCnt[Math.floor(i/2)].rpt1, repeatCnt[Math.floor(i/2)].rpt2 );
            materials.push(new THREE.MeshLambertMaterial({map:plainTexture}));
        }
       var material = new THREE.MeshFaceMaterial(materials);
       return material;
    }
    function defPlane(w, h, rtAngleDeg, texPath, texMode, centerPos) {
        var GenericPlane = new THREE.PlaneGeometry( w, h );
        var floorTexture = THREE.ImageUtils.loadTexture(texPath);
        if (texMode!=null) {
            
            floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
            floorTexture.repeat.set( texMode.x, texMode.y ); }
        material = new THREE.MeshLambertMaterial({map: floorTexture, side:THREE.DoubleSide});
        var yobaplane = new THREE.Mesh( GenericPlane, material );
        yobaplane.position.x=centerPos.x; yobaplane.position.y=centerPos.y; yobaplane.position.z=centerPos.z;
        //yobaplane.rotation.x += degInRad(rtAngleDeg.x); yobaplane.rotation.y+=degInRad(rtAngleDeg.y); yobaplane.rotation.z+=degInRad(rtAngleDeg.z);
        yobaplane.rotateOnAxis(new THREE.Vector3(1, 0, 0), degInRad(rtAngleDeg.x));
        yobaplane.rotateOnAxis(new THREE.Vector3(0, 1, 0), degInRad(rtAngleDeg.y));
        yobaplane.rotateOnAxis(new THREE.Vector3(0, 0, 1), degInRad(rtAngleDeg.z));
        return yobaplane;
    }
    /**
     * 
     * @param {integer} w - width; measured along 0x axis
     * @param {integer} h - height; measured along 0y axis 
     * @param {integer} d - 
     * @param {type} rtAngleDeg - rotation angle of cube
     * @param {type} material
     * @param {type} centerPos
     * @returns {defCube.myCube|THREE.Mesh}
     */
    function defCube(w,h,d,rtAngleDeg, material, centerPos) {
        var geometry = new THREE.BoxGeometry( w, h, d );                 
        var myCube = new THREE.Mesh( geometry, material );
        myCube.position.z = centerPos.z; myCube.position.y = centerPos.y; myCube.position.x=centerPos.x;
        return myCube;
    }
    function MakeBuilding(w,h,d, material, centerPos, DoorsArr, wndArr) {
        var Bld1 = defCube(w, h, d, 0, 
                           material, centerPos);
        
        for (var i=0; i<DoorsArr.length; i++) {
            //position of door is now relative to building
            console.log("door!");
            /*var doorPlane=defPlane(DoorsArr[i].w, DoorsArr[i].h, new THREE.Vector3(0,0,0), 'graphon/DoorsMetalOrnate.jpg', null, new THREE.Vector3(10,10,10));
            scene.add(doorPlane); 
            doorPlane.position.x = DoorsArr[i].planeLocation.x; doorPlane.position.y=DoorsArr[i].planeLocation.y; doorPlane.position.z=DoorsArr[i].planeLocation.z;*/
        }
        scene.add(Bld1);
    }
    /**
     * The 'street' is a line of buildings with the same width or depth standing close to each other
     * @param {type} farNorthSide
     * @param {type} farSouthSide
     * @param {type} eastAlignLine
     * @param {type} constantDepth
     * @returns {undefined}
     */
    function MakeStreetNS(farNorthSide, farSouthSide, eastAlignLine, constantDepth) { 
        var curBldHeightInt; var curBldWidthInt; var curBldDepthInt; var curHorLoc = farNorthSide;  var d1=0; var d2=0;
        do {
            curBldHeightInt = getRandomInt(2,6);
            curBldWidthInt = getRandomInt(2,4);
            //curBldDepthInt = getRandomInt(2,4);
            curBldDepthInt=constantDepth;
            /*var myCubeBld = defCube(curBldWidthInt*myUnitSz, curBldHeightInt*myUnitSz, curBldDepthInt*myUnitSz, 0, defCrateMaterial(), 
                                  new THREE.Vector3(farEastSide,Math.floor(curBldHeightInt*myUnitSz/2),curHorLoc));*/
             MakeBuilding(curBldWidthInt*myUnitSz, curBldHeightInt*myUnitSz, curBldDepthInt*myUnitSz,
                          defPlainMaterialCube([new function() {this.rpt1=curBldDepthInt; this.rpt2=curBldHeightInt;}, new function() {this.rpt1=curBldWidthInt; this.rpt2=curBldDepthInt;}, new function() {this.rpt1=curBldDepthInt; this.rpt2=curBldHeightInt;}],
                          'graphon/ConcreteBare.jpg'),
                          new THREE.Vector3(eastAlignLine,Math.floor(curBldHeightInt*myUnitSz/2),curHorLoc),
                          [], []                                   );
            //console.log("w:"+curBldWidthInt+"("+curBldWidthInt*myUnitSz+")"+"; h:"+curBldHeightInt+"; d:"+curBldDepthInt+"("+curBldDepthInt*myUnitSz+")"+"; "+curHorLoc);                      
            d1=curBldDepthInt;
            if (d2==0) { d2=d1; }
            curHorLoc+=Math.round(d1*myUnitSz/2)+Math.round(d2*myUnitSz/2);
            console.log("dtemp: "+d1+";"+d2);
            d2=d1;
            //scene.add(myCubeBld);            
        } while (curHorLoc<farSouthSide)
    }
    function MakeStreetWE (farWestSide, farEastSide, northAlignLine, constantWidth) {
        var curBldHeightInt; var curBldWidthInt; var curBldDepthInt; var curHorLoc = farWestSide;  var d1=0; var d2=0;
        do {
            curBldHeightInt = getRandomInt(2,6);
            curBldWidthInt = constantWidth;
            //curBldDepthInt = getRandomInt(2,4);
            curBldDepthInt=getRandomInt(2,4);
            /*var myCubeBld = defCube(curBldWidthInt*myUnitSz, curBldHeightInt*myUnitSz, curBldDepthInt*myUnitSz, 0, defCrateMaterial(), 
                                  new THREE.Vector3(farEastSide,Math.floor(curBldHeightInt*myUnitSz/2),curHorLoc));*/
             MakeBuilding(curBldWidthInt*myUnitSz, curBldHeightInt*myUnitSz, curBldDepthInt*myUnitSz,
                          defPlainMaterialCube([new function() {this.rpt1=curBldDepthInt; this.rpt2=curBldHeightInt;}, new function() {this.rpt1=curBldDepthInt; this.rpt2=curBldWidthInt;}, new function() {this.rpt1=curBldDepthInt; this.rpt2=curBldHeightInt;}],
                          'graphon/ConcreteBare.jpg'),
                          new THREE.Vector3(curHorLoc,Math.floor(curBldHeightInt*myUnitSz/2),northAlignLine),
                          [], []                                   );
            //console.log("w:"+curBldWidthInt+"("+curBldWidthInt*myUnitSz+")"+"; h:"+curBldHeightInt+"; d:"+curBldDepthInt+"("+curBldDepthInt*myUnitSz+")"+"; "+curHorLoc);                      
            d1=curBldWidthInt;
            if (d2==0) { d2=d1; }
            curHorLoc+=Math.round(d1*myUnitSz/2)+Math.round(d2*myUnitSz/2);
            console.log("dtemp: "+d1+";"+d2);
            d2=d1;
            //scene.add(myCubeBld);            
        } while (curHorLoc<farEastSide)
    }

function addCamera() {
            //idea from http://jsfiddle.net/ostapische/uFwFC/2/
    camera.position.x=0;
    camera.position.y = Math.round(myUnitSz/2); camera.position.z = 0;
    neck = new THREE.Object3D();
    neck.position.x = camera.position.x;
    neck.position.z = camera.position.z;
    neck.position.y = camera.position.y;
            //neck.rotateOnAxis(new THREE.Vector3(1, 0, 0), degInRad(90));
            //neck.up = new THREE.Vector3(0, 0, 1);
    neck.up = new THREE.Vector3(0, 1, 0);
        var cubeGeometry = new THREE.CubeGeometry(myUnitSz,myUnitSz,myUnitSz,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
	MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
        MovingCube.position.x = neck.position.x;
        MovingCube.position.z = neck.position.z;
        MovingCube.position.y = neck.position.y;
        neck.add(MovingCube);
    console.log("handler position: "+neck.position.x+";"+neck.position.y+";"+neck.position.z);        
    neck.add(camera);
    scene.add(neck);
    //also need to add some another mesh object to neck, for collision detection, like on http://stemkoski.github.io/Three.js/Collision-Detection.html
    //done. see MovingCube
}        
function defScene() {
    yobaplane2=defPlane(15*myUnitSz, 15*myUnitSz, new THREE.Vector3(90,0,0), 'graphon/FloorStreets.jpg', new function() {this.x=15; this.y=15}, new THREE.Vector3(0,0,0));
    scene.add( yobaplane2 ); 
        addCamera();
    defMainHall();
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 150*myUnitSz, 0); 
    scene.add(pointLight);
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
}
function defMainHall() {
    var sectionWidthPts=6; var sectionHeightPts=2;
    var northWall11 = defCube(sectionWidthPts*myUnitSz, sectionHeightPts*myUnitSz, Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=sectionWidthPts; this.rpt2=sectionHeightPts;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(-Math.round(4.5*myUnitSz), Math.round((sectionHeightPts/2)*myUnitSz), -Math.round(7.5*myUnitSz)));
    var northWall12 = defCube(sectionWidthPts*myUnitSz, sectionHeightPts*myUnitSz, Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=sectionWidthPts; this.rpt2=sectionHeightPts;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(Math.round(4.5*myUnitSz), Math.round((sectionHeightPts/2)*myUnitSz), -Math.round(7.5*myUnitSz)));
    //main gate
    var doorPlane=defPlane(3*myUnitSz, 2*myUnitSz, new THREE.Vector3(0,0,0), 'graphon/DoorsWoodBigHiRes.jpg', null, new THREE.Vector3(0,myUnitSz,-Math.round(7.5*myUnitSz)));
    scene.add(doorPlane);
    sectionWidthPts=15; sectionHeightPts=2;
    var northWall21 = defCube(sectionWidthPts*myUnitSz, sectionHeightPts*myUnitSz, Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=sectionWidthPts; this.rpt2=sectionHeightPts;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(0, Math.round((2+sectionHeightPts/2)*myUnitSz), -Math.round(7.5*myUnitSz)));
    //north wall: gallery
    var startPos = -7; sectionWidthPts=1; sectionHeightPts=2;
    while (startPos<=7) {
        var northWall3 = defCube(sectionWidthPts*myUnitSz, sectionHeightPts*myUnitSz, Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=sectionWidthPts; this.rpt2=sectionHeightPts;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(startPos*myUnitSz, Math.round((2+2+sectionHeightPts/2)*myUnitSz), -Math.round(7.5*myUnitSz)));
        scene.add(northWall3);
        if (startPos+1<=7) {
        var northWndUpper = defCube(Math.round((sectionWidthPts)*myUnitSz), Math.round(sectionHeightPts/4*myUnitSz), Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=1; this.rpt2=sectionHeightPts;}, new function() {this.rpt1=sectionWidthPts; this.rpt2=sectionHeightPts;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3((startPos+1)*myUnitSz, Math.round((2+2+sectionHeightPts/2+3/4)*myUnitSz), -Math.round(7.5*myUnitSz)));
                  scene.add(northWndUpper); }
        startPos+=2;     }
    
    var southWall = defCube(15*myUnitSz, 6*myUnitSz, Math.round(0.25*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=15; this.rpt2=6;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(0,3*myUnitSz,Math.round(7.5*myUnitSz) ));
    var southPillar1 = defCube(1*myUnitSz, 6*myUnitSz, Math.round(1*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=1; this.rpt2=6;}],
                            'graphon/ConcreteBare2.jpg'), 
                          new THREE.Vector3(-Math.round(7.5*myUnitSz),3*myUnitSz,Math.round(7.5*myUnitSz) ));
    var southPillar2 = defCube(1*myUnitSz, 6*myUnitSz, Math.round(1*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=1; this.rpt2=6;}],
                            'graphon/ConcreteBare2.jpg'), 
                          new THREE.Vector3(Math.round(7.5*myUnitSz),3*myUnitSz,Math.round(7.5*myUnitSz) ));
    var northPillar1 = defCube(1*myUnitSz, 6*myUnitSz, Math.round(1*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=1; this.rpt2=6;}],
                            'graphon/ConcreteBare2.jpg'), 
                          new THREE.Vector3(-Math.round(7.5*myUnitSz),3*myUnitSz,-Math.round(7.5*myUnitSz) ));
    var northPillar2 = defCube(1*myUnitSz, 6*myUnitSz, Math.round(1*myUnitSz), 0, 
                            defPlainMaterialCube([new function() {this.rpt1=1; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=1; this.rpt2=6;}],
                            'graphon/ConcreteBare2.jpg'), 
                          new THREE.Vector3(Math.round(7.5*myUnitSz),3*myUnitSz,-Math.round(7.5*myUnitSz) ));
    var eastWall = defCube(Math.round(0.25*myUnitSz), 6*myUnitSz, 15*myUnitSz, 0, 
                            defPlainMaterialCube([new function() {this.rpt1=15; this.rpt2=6;}, new function() {this.rpt1=6; this.rpt2=1;}, new function() {this.rpt1=15; this.rpt2=6;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(Math.round(7.5*myUnitSz),3*myUnitSz, 0));   
    var westWall = defCube(Math.round(0.25*myUnitSz), 6*myUnitSz, 15*myUnitSz, 0, 
                            defPlainMaterialCube([new function() {this.rpt1=15; this.rpt2=6;}, new function() {this.rpt1=1; this.rpt2=15;}, new function() {this.rpt1=1; this.rpt2=6;}],
                            'graphon/WhiteBrick.jpg'), 
                          new THREE.Vector3(-Math.round(7.5*myUnitSz),Math.round(3*myUnitSz), 0));    
    
    var simpleCeiling = defPlane(15*myUnitSz, 15*myUnitSz, new THREE.Vector3(90,0,0), 'graphon/ConcreteBare.jpg', new function() {this.x=15; this.y=15}, new THREE.Vector3(0,6*myUnitSz,0));
    scene.add(northWall11); scene.add(northWall12); scene.add(northWall21); scene.add(simpleCeiling);
    scene.add(southWall); scene.add(eastWall); scene.add(westWall);
    scene.add(southPillar1); scene.add(southPillar2); scene.add(northPillar1); scene.add(northPillar2);
    //some test crates
    var myCube2 = defCube(myUnitSz, myUnitSz, myUnitSz, 0, defCrateMaterial(), new THREE.Vector3(-2*myUnitSz,Math.round(myUnitSz/2),-3*myUnitSz));
    var myCube3 = defCube(myUnitSz, myUnitSz, myUnitSz, 0, defCrateMaterial(), new THREE.Vector3(3*myUnitSz,Math.round(myUnitSz/2),-4*myUnitSz));
    scene.add(myCube2); scene.add(myCube3);
    //define collision boxes here
    myLevelStruct.Cubes.push(southWall); myLevelStruct.Cubes.push(eastWall); myLevelStruct.Cubes.push(westWall); myLevelStruct.Cubes.push(northWall11);
    myLevelStruct.Cubes.push(northWall12); myLevelStruct.Cubes.push(northWall21); myLevelStruct.Cubes.push(myCube2); myLevelStruct.Cubes.push(myCube3);
}   
// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
