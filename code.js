var today = new Date();

var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};

export var day = today.toLocaleDateString("en-US", options);
