export class Diamond {
  element;

  constructor(params) {
    this.params = params;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.verticalAlign = "top";
    svg.style.width = "1px";
    svg.style.height = "1px";
    svg.style.transformOrigin = "0 0";
    svg.style.scale = params.parent.getBoundingClientRect().width;

    const circles = {};
    for (let i = 0; i < 4; i++) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.style.fill = "none";
      circle.style.stroke = "hsl(0, 0%, 60%)";
      circle.style.strokeWidth = 1 / 64;
      circle.classList.add(["right", "up", "left", "down"][i]);
      circle.setAttribute("cx", 1 / 2 + 0.25 * ((i === 0) - (i === 2)));
      circle.setAttribute("cy", 1 / 2 - 0.25 * ((i === 1) - (i === 3)));
      circle.setAttribute("r", 1 / 8);
      svg.append(circle);
      circles[["right", "up", "left", "down"][i]] = circle;
    }

    params.parent.append(svg);

    this.pressed = new Proxy(this.params.statuses, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        target[prop] = value;
        circles[prop].style.fill = `hsl(0, 0%, 80%, ${
          target[prop] ? 100 : 0
        }%)`;
        return true;
      },
    });

    svg.ontouchstart = (event) => {
      this.move(event);
    };
    svg.ontouchmove = (event) => {
      this.move(event);
    };
    svg.ontouchend = () => {
      this.pressed.right = 0;
      this.pressed.up = 0;
      this.pressed.left = 0;
      this.pressed.down = 0;
    };
  }

  move(event) {
    event.preventDefault();
    const boundingClientRect = this.params.parent.getBoundingClientRect();
    const x = 2 *
        (event.touches[0].clientX - globalThis.pageXOffset -
          boundingClientRect.x) /
        boundingClientRect.width - 1;
    const y = 1 -
      2 *
        (event.touches[0].clientY - globalThis.pageYOffset -
          boundingClientRect.y) /
        boundingClientRect.height;

    const angle = Math.atan2(y, x);
    const radius = Math.sqrt(x ** 2 + y ** 2);

    const last = {
      right: this.pressed.right,
      up: this.pressed.up,
      left: this.pressed.left,
      down: this.pressed.down,
    }

    if (radius >= 1 / 8 && radius <= 7 / 8) {
      this.pressed.right = (angle >= -2 * Math.PI / 6 && angle <= 2 * Math.PI / 6) * 1;
      this.pressed.up = (angle >= 1 * Math.PI / 6 && angle <= 5 * Math.PI / 6) * 1;
      this.pressed.left = (angle >= 4 * Math.PI / 6 || angle <= -4 * Math.PI / 6) * 1;
      this.pressed.down = (angle >= -5 * Math.PI / 6 && angle <= -1 * Math.PI / 6) * 1;
    }
    
    this.pressed.right |= (!last.right && this.pressed.right) * 2;
    this.pressed.up |= (!last.up && this.pressed.up) * 2;
    this.pressed.left |= (!last.left && this.pressed.left) * 2;
    this.pressed.down |= (!last.down && this.pressed.down) * 2;
  }
}
