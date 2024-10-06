<template>
  <v-container>
    <div ref="matter"></div>
  </v-container>
</template>

<script lang="ts">
// const loadImage = (url: string, onSuccess: any, onError: any) => {
//   const img = new Image();
//   img.onload = () => {
//     onSuccess(img.src);
//   };
//   img.onerror = onError();
//   img.src = url;
// };
import Vue from "vue";
import {
  Engine,
  Render,
  Composite,
  Bodies,
  Runner,
  MouseConstraint,
  Mouse,
  Vector,
  Composites,
  Body,
  Constraint,
} from "matter-js";
export default Vue.extend({
  async mounted() {
    // create an engine
    const engine = Engine.create();

    // create a renderer
    const render = Render.create({
      element: this.$refs["matter"] as HTMLElement,
      engine: engine,
      options: {
        width: 64 * 20,
        height: 64 * 12,
        pixelRatio: 2,
        background: "/images/1617470215_1-p-oboi-multyashnoe-nebo-1.jpg",
        // wireframeBackground: "#12a",
        // hasBounds: false,
        wireframes: false,
        // showSleeping: true,
        // showDebug: false,
        // showBroadphase: false,
        // showBounds: false,
        // showVelocity: false,
        // showCollisions: false,
        // showSeparations: false,
        // showAxes: false,
        // showPositions: true,
        // showAngleIndicator: false,
        // showIds: false,
        // showVertexNumbers: false,
        // showConvexHulls: false,
        // showInternalEdges: false,
        // showMousePosition: false,
        // showStats: false,
        // showPerformance: false,
      },
    });
    // const scales = Bodies.rectangle(600, 500, 10, 500, {
    //   isStatic: true,
    //   render: {
    //     sprite: {
    //       texture: "/images/Battle_City_bricks.png",
    //       xScale: 1,
    //       yScale: 1,
    //     },
    //   },
    // });
    // const scales2 = Bodies.rectangle(600, 240, 500, 10, {
    //   render: {
    //     sprite: {
    //       texture: "/images/Battle_City_bricks.png",
    //       xScale: 1,
    //       yScale: 1,
    //     },
    //   },
    // });
    // create two boxes and a ground
    const mario = Bodies.rectangle(150, 80, 50, 64, {
      // frictionAir: 0.5,
      render: {
        sprite: {
          texture: "/images/228334077058212.png",
          xScale: 0.071,
          yScale: 0.071,
        },
      },
    });

    const ground = [
      Bodies.rectangle(640, 32, 1280, 64, {
        isStatic: true,
      }),
      Bodies.rectangle(640, 64 * 12 - 32, 1200, 64, {
        isStatic: true,
      }),

      Bodies.rectangle(1280 - 32, 400, 64, 800, {
        isStatic: true,
      }),
      Bodies.rectangle(32, 400, 64, 800, {
        isStatic: true,
      }),
      ...[
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ].map((e) =>
        Bodies.rectangle(e * 64 + 32, 32, 64, 64, {
          isStatic: true,
          render: {
            sprite: {
              texture: "/images/Battle_City_bricks.png",
              xScale: 1,
              yScale: 1,
            },
          },
        })
      ),
      ...[
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ].map((e) =>
        Bodies.rectangle(e * 64 + 32, 64 * 11 + 32, 64, 64, {
          isStatic: true,
          render: {
            sprite: {
              texture: "/images/Battle_City_bricks.png",
              xScale: 1,
              yScale: 1,
            },
          },
        })
      ),
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) =>
        Bodies.rectangle(32, e * 64 + 32, 64, 64, {
          isStatic: true,
          render: {
            sprite: {
              texture: "/images/Battle_City_bricks.png",
              xScale: 1,
              yScale: 1,
            },
          },
        })
      ),
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) =>
        Bodies.rectangle(64 * 20 - 32, e * 64 + 32, 64, 64, {
          isStatic: true,
          render: {
            sprite: {
              texture: "/images/Battle_City_bricks.png",
              xScale: 1,
              yScale: 1,
            },
          },
        })
      ),
    ];

    const ball = [
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((e) =>
        Bodies.circle(64 * e + 64, 80, 20, {
          label: "aeressds3",
          friction: 0.05,
          frictionAir: 0.0005,
          restitution: 0.9,
          render: {
            sprite: {
              texture: "/images/SoccerBall_0.png",
              xScale: 0.4,
              yScale: 0.4,
            },
          },
        })
      ),
    ];

    // const circle = Bodies.circle(50, 50, 50, {
    //   label: "aeressds4",
    //   speed: 2,
    //   render: {
    //     visible: true,
    //     fillStyle: "#a52",
    //     opacity: 1,
    //     sprite: {
    //       texture: "/images/228334077058212.png",
    //       xScale: 0.1,
    //       yScale: 0.1,
    //     },
    //   },
    // }); // creates a circular body
    // const fromVertices = Bodies.fromVertices(500, 500, vext); // creates a polygon from a bunch of vertices
    // const polygon = Bodies.polygon(456, 345, 10, 65); // creates a regular polygon from a number of sides

    // const trapezoid = Bodies.trapezoid(911, 100, 100, 500, 2, {
    //   render: {
    //     sprite: {
    //       texture: "/images/228334077058212.png",
    //       xScale: 0.1,
    //       yScale: 0.1,
    //     },
    //   },
    // }); // creates a trapezoid with its base being a horizontal line
    // add all of the bodies to the world
    const group = Body.nextGroup(true);
    const stack = Composites.stack(
      250,
      255,
      1,
      6,
      0,
      0,
      function (x: number, y: number) {
        return Bodies.rectangle(x, y, 30, 30);
      }
    );

    const catapult = Bodies.rectangle(400, 520, 600, 10, {
      collisionFilter: { group: group },
      render: { fillStyle: "#A60a19" },
    });

    const scale1 = Bodies.rectangle(695, 520, 10, 200, {
      render: { fillStyle: "#A60a19" },
    });
    const bridge = Composites.stack(
      160,
      290,
      3,
      3,
      0,
      0,
      function (x: number, y: number) {
        return Bodies.rectangle(x - 20, y, x, 10, {
          collisionFilter: { group: group },
          chamfer: { radius: 5 },
          density: 0.005,
          frictionAir: 0.05,
          render: {
            fillStyle: "#06Ea19",
          },
        });
      }
    );
    Composites.chain(bridge, 0.45, 0, -0.45, 0, {
      stiffness: 1,
      length: 0,
      render: {
        visible: false,
      },
    });
    Composite.add(engine.world, [
      mario,
      // boxB,
      ...ground,
      stack,
      catapult,
      bridge,
      // Bodies.rectangle(400, 535, 20, 200, {
      //   isStatic: true,
      //   collisionFilter: { group: group },
      //   render: { fillStyle: "#060a19" },
      // }),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0,
      }),
      scale1,
      Constraint.create({
        bodyA: scale1,
        pointB: Vector.clone(scale1.position),
        stiffness: 1,
        length: 0,
      }),
      // circle,
      // polygon,
      // trapezoid,
      // fromVertices,
      // scales,
      // scales2,
      ...ball,
    ]);
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;
    // run the renderer

    Render.run(render);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
  },
  methods: {
    loadImage(
      src: string,
      name: string
    ): Promise<{ img: HTMLImageElement; name: string }> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ img, name });
        img.onerror = reject;
        img.src = src;
      });
    },
  },
});
</script>
