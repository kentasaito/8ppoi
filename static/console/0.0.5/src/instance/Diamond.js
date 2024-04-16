export class Diamond {
  radii;
  angles;
  statuses;

  constructor(params) {
    this.radii = {
      lower: 1 / 8,
      upper: 7 / 8,
    };

    this.angles = {
      right: {
        lower: -2 * Math.PI / 6,
        upper: 2 * Math.PI / 6,
      },
      up: {
        lower: 1 * Math.PI / 6,
        upper: 5 * Math.PI / 6,
      },
      left: {
        lower: 4 * Math.PI / 6,
        upper: -4 * Math.PI / 6,
      },
      down: {
        lower: -5 * Math.PI / 6,
        upper: -1 * Math.PI / 6,
      },
    };

    this.statuses = new Proxy(params.statuses, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        if (value === target[prop]) return true;
        target[prop] = value;
        params.element.querySelector(`.${prop}`).style.fill = target[prop] & 1
          ? "hsl(0, 0%, 80%)"
          : "none";
        return true;
      },
    });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "-1 -1 2 2");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.fill = "none";
    svg.style.stroke = "hsl(0, 0%, 60%)";
    svg.style.strokeWidth = 0.0625;
    params.element.append(svg);

    for (const buttonName in this.statuses) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.classList.add(buttonName);
      circle.setAttribute(
        "cx",
        buttonName === "right" ? 0.5 : buttonName === "left" ? -0.5 : 0,
      );
      circle.setAttribute(
        "cy",
        buttonName === "up" ? -0.5 : buttonName === "down" ? 0.5 : 0,
      );
      circle.setAttribute("r", 0.25);
      svg.append(circle);
    }

    params.element.ontouchstart =
      params.element.ontouchmove =
      params.element.ontouchend =
        (event) => this.onTouchChange(event);
  }

  onTouchChange(event) {
    event.preventDefault();

    const rect = event.target.getBoundingClientRect();

    const buffers = {};
    for (const buttonName in this.statuses) {
      buffers[buttonName] = 0;
    }
    for (const touch of event.touches) {
      const x = (touch.clientX - rect.left) / rect.width * 2 - 1;
      const y = (touch.clientY - rect.top) / rect.height * -2 + 1;
      const radius = Math.sqrt(x ** 2 + y ** 2);
      if (radius >= this.radii.lower && radius < this.radii.upper) {
        const angle = Math.atan2(y, x);
        buffers.right = (
          angle >= this.angles.right.lower && angle < this.angles.right.upper
        ) * 1;
        buffers.up = (
          angle >= this.angles.up.lower && angle < this.angles.up.upper
        ) * 1;
        buffers.left = (
          angle >= this.angles.left.lower || angle < this.angles.left.upper
        ) * 1;
        buffers.down = (
          angle >= this.angles.down.lower && angle < this.angles.down.upper
        ) * 1;
      }
    }
    for (const buttonName in this.statuses) {
      this.statuses[buttonName] = buffers[buttonName];
    }
  }
}
