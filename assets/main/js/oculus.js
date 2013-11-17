// Generated by CoffeeScript 1.6.3
(function() {
  window.App.init = function() {
    var oculusBridge;
    window.App.viewAngle = 0;
    window.App.startTime = Date.now();
    window.App.time = Date.now();
    window.App.bodyAngle = Math.PI;
    window.App.bodyVerticalAngle = 0;
    window.App.bodyAxis = new THREE.Vector3(0, 1, 0);
    window.App.bodyPosition = new THREE.Vector3(0, 15, 0);
    window.App.velocity = new THREE.Vector3();
    window.App.speed = 1.0;
    App.initScene();
    App.initGeometry();
    App.initLights();
    oculusBridge = new OculusBridge({
      "debug": true,
      "onOrientationUpdate": function(quatValues) {
        var key, quat, quatCam, value, xzVector;
        for (key in quatValues) {
          value = quatValues[key];
          $("#o" + (key.toUpperCase())).text(value.toFixed(2));
          App.data["o" + (key.toUpperCase())] = value;
        }
        quat = new THREE.Quaternion();
        quat.setFromAxisAngle(App.bodyAxis, -App.bodyAngle);
        quatCam = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);
        quat.multiply(quatCam);
        xzVector = new THREE.Vector3(0, 0, 1);
        xzVector.applyQuaternion(quat);
        App.viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;
        return App.camera.quaternion.copy(quat);
      },
      "onConfigUpdate": function(config) {
        return App.riftCam.setHMD(config);
      },
      "onConnect": function() {
        App.useRift = true;
        $('#hud .oculus .disconnected').fadeOut(250);
        $('#hud .oculus .connected').fadeIn(250);
        return $('body').addClass('useRift');
      },
      "onDisconnect": function() {
        App.useRift = false;
        $('#hud .oculus .disconnected').fadeIn(250);
        $('#hud .oculus .connected').fadeOut(250);
        return $('body').removeClass('useRift');
      }
    });
    oculusBridge.connect();
    return window.App.riftCam = new THREE.OculusRiftEffect(App.renderer);
  };

  window.App.initScene = function() {
    var aspectRatio, element, mouse, windowHalf;
    window.App.clock = new THREE.Clock();
    mouse = new THREE.Vector2(0, 0);
    windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    aspectRatio = window.innerWidth / window.innerHeight;
    window.App.scene = new THREE.Scene();
    window.App.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.01, 10000);
    App.camera.useQuaternion = true;
    App.camera.eulerOrder = "YXZ";
    App.camera.fov *= 5 / 3.0;
    App.camera.updateProjectionMatrix();
    App.camera.position.set(100, 15, 100);
    App.camera.lookAt(App.scene.position);
    window.App.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    App.renderer.setClearColor(0x000000);
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.scene.fog = new THREE.Fog(0x000000, 250, 750);
    element = document.getElementById('viewport');
    return element.appendChild(App.renderer.domElement);
  };

  window.App.initLights = function() {
    var ambient;
    ambient = new THREE.AmbientLight(0xffffff);
    App.scene.add(ambient);
    window.App.headlights = new THREE.PointLight(0xffffff, 0.9, 300);
    App.headlights.position.set(0, 0, 10);
    return App.shipParent.add(App.headlights);
  };

  window.App.initGeometry = function() {
    var floor, floorGeometry, floorMaterial, floorTexture, i, material, shipTexture, targetGeometry, targetMaterial, targetTexture, _i;
    window.App.boxes = [];
    for (i = _i = 0; _i <= 250; i = ++_i) {
      App.addBox();
    }
    window.App.shots = [];
    window.App.shipParent = new THREE.Object3D();
    App.shipParent.eulerOrder = "YXZ";
    App.scene.add(App.shipParent);
    shipTexture = new THREE.ImageUtils.loadTexture("/assets/textures/ship.png");
    shipTexture.wrapS = shipTexture.wrapT = THREE.RepeatWrapping;
    shipTexture.repeat.set(1, 1);
    shipTexture.anisotropy = 32;
    material = new THREE.MeshLambertMaterial({
      map: shipTexture,
      transparent: true,
      opacity: 1.0,
      color: 0x000000
    });
    window.App.ship = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), material);
    App.ship.eulerOrder = "YXZ";
    App.ship.geometry.vertices[0].x += 1;
    App.ship.geometry.vertices[0].z += 10;
    App.ship.geometry.vertices[1].x += 3;
    App.ship.geometry.vertices[1].z -= 10;
    App.ship.geometry.vertices[4].x -= 3;
    App.ship.geometry.vertices[4].z -= 10;
    App.ship.geometry.vertices[5].x -= 1;
    App.ship.geometry.vertices[5].z += 10;
    App.ship.position.set(0, -3, 0);
    App.shipParent.add(App.ship);
    targetTexture = new THREE.ImageUtils.loadTexture("/assets/textures/targeting.png");
    targetTexture.wrapS = targetTexture.wrapT = THREE.RepeatWrapping;
    targetTexture.repeat.set(1, 1);
    targetTexture.anisotropy = 32;
    targetMaterial = new THREE.MeshLambertMaterial({
      map: targetTexture,
      transparent: true,
      opacity: 0.75
    });
    targetGeometry = new THREE.PlaneGeometry(0.25, 0.25, 1, 1);
    window.App.target = new THREE.Mesh(targetGeometry, targetMaterial);
    App.target.side = THREE.DoubleSide;
    App.target.position.set(0.0, -0.02, 3);
    App.target.rotation.y = +Math.PI;
    App.shipParent.add(App.target);
    floorTexture = new THREE.ImageUtils.loadTexture("/assets/textures/tile.jpg");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5000, 1);
    floorTexture.anisotropy = 32;
    floorMaterial = new THREE.MeshLambertMaterial({
      map: floorTexture,
      transparent: true,
      opacity: 0.5
    });
    floorGeometry = new THREE.PlaneGeometry(1000000, 500, 1, 1);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -250, 500000 - 500);
    floor.side = THREE.DoubleSide;
    floor.rotation.x = -Math.PI / 2;
    floor.rotation.z = +Math.PI / 2;
    App.scene.add(floor);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, 250, 500000 - 500);
    floor.side = THREE.DoubleSide;
    floor.rotation.x = +Math.PI / 2;
    floor.rotation.z = +Math.PI / 2;
    App.scene.add(floor);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(250, 0, 500000 - 500);
    floor.side = THREE.DoubleSide;
    floor.rotation.y = -Math.PI / 2;
    App.scene.add(floor);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(-250, 0, 500000 - 500);
    floor.side = THREE.DoubleSide;
    floor.rotation.y = +Math.PI / 2;
    return App.scene.add(floor);
  };

  window.App.addBox = function(options) {
    var box, height, material, rand, width, zCoord;
    if (options == null) {
      options = {};
    }
    if (Math.random() > 0.3) {
      material = new THREE.MeshLambertMaterial({
        color: Math.round(Math.random() * 16777215),
        ambient: 0x151515
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        color: Math.round(Math.random() * 16777215),
        ambient: 0x151515,
        specular: 0xffffff
      });
    }
    height = Math.random() * 25 + 5;
    width = height + (Math.random() * 6 - 3);
    rand = Math.random();
    if (rand < 0.5) {
      box = new THREE.Mesh(new THREE.CubeGeometry(width, height, width), material);
    } else if (rand < 0.96) {
      box = new THREE.Mesh(new THREE.SphereGeometry(height), material);
    } else {
      box = new THREE.Mesh(new THREE.TorusGeometry(height * 2.5, 3 + Math.random() * height / 2, 8, 4), material);
    }
    zCoord = App.camera.position.z;
    if (options.aheadOnly) {
      zCoord += 500 + 250 * Math.random();
    } else {
      zCoord = Math.random() * 1000 - 250;
    }
    box.position.set(Math.random() * 600 - 300, Math.random() * 600 - 300, zCoord);
    box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    App.boxes.push(box);
    return App.scene.add(box);
  };

  window.App.fire = function() {
    var material, shot, shot_sound;
    material = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      ambient: 0x00ff00
    });
    shot = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 4), material);
    shot.position.set(-1, -4, 5);
    App.shots.push(shot);
    App.shipParent.add(shot);
    shot = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 4), material);
    shot.position.set(1, -4, 5);
    App.shots.push(shot);
    App.shipParent.add(shot);
    shot_sound = document.getElementById('shot_sound');
    shot_sound.pause();
    shot_sound.volume = 0.3;
    shot_sound.currentTime = 0.0;
    return shot_sound.play();
  };

  window.App.updateInput = function(delta) {
    var step, turn_speed;
    step = 40 * delta * App.speed;
    turn_speed = 0.05 * delta;
    if (App.data.cY) {
      App.bodyAngle += App.data.cY * turn_speed;
    }
    if (App.data.cZ) {
      App.bodyVerticalAngle += App.data.cZ * turn_speed;
    }
    App.bodyPosition.x += Math.sin(App.bodyAngle) * step;
    App.bodyPosition.y -= Math.sin(App.bodyVerticalAngle) * step;
    App.bodyPosition.z -= Math.cos(App.bodyAngle) * step;
    App.camera.position.set(App.bodyPosition.x, App.bodyPosition.y, App.bodyPosition.z);
    App.camera.rotation.x += -App.bodyVerticalAngle;
    App.shipParent.position.set(App.bodyPosition.x, App.bodyPosition.y, App.bodyPosition.z);
    App.shipParent.rotation.y = -App.bodyAngle - Math.PI;
    return App.shipParent.rotation.x = App.bodyVerticalAngle;
  };

  window.App.animate = function() {
    var box, delta, quat, shot, xzVector, _i, _j, _len, _len1, _ref, _ref1;
    delta = App.clock.getDelta();
    App.time += delta;
    if (App.controllerConnected || true) {
      App.updateInput(delta);
      _ref = App.boxes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        box = _ref[_i];
        box.rotation.x += delta * 0.4;
        box.rotation.y -= delta * 0.2;
        box.rotation.z += delta * 0.3;
        if (!(box.position.z > App.camera.position.z - 200)) {
          App.scene.remove(box);
          App.addBox({
            aheadOnly: true
          });
        }
      }
      _ref1 = App.shots;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        shot = _ref1[_j];
        shot.position.z += delta * 800;
        if (!Math.abs(shot.position.z - App.camera.position.z) < 1000) {
          App.scene.remove(shot);
        }
      }
      App.boxes = App.boxes.filter(function(box) {
        return box.position.z > App.camera.position.z - 200;
      });
    } else {
      App.updateInput(0.0);
    }
    requestAnimationFrame(App.animate);
    if (App.useRift) {
      return App.riftCam.render(App.scene, App.camera);
    } else {
      quat = new THREE.Quaternion();
      quat.setFromAxisAngle(App.bodyAxis, -App.bodyAngle);
      xzVector = new THREE.Vector3(0, 0, 1);
      xzVector.applyQuaternion(quat);
      App.viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;
      App.camera.quaternion.copy(quat);
      App.camera.rotation.x += -App.bodyVerticalAngle;
      return App.renderer.render(App.scene, App.camera);
    }
  };

  window.onload = function() {
    App.init();
    return App.animate();
  };

}).call(this);
