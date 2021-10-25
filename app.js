const courseSelectDOM = document.querySelector("#courseSelect");

async function fetchCourses() {
  let url = "https://golf-courses-api.herokuapp.com/courses";
  let rawData = await fetch(url);
  let jsonData = await rawData.json();
  console.log(jsonData.courses);

  for (course of jsonData.courses) {
    courseSelectDOM.innerHTML += `<option value="${course.id}">${course.name}</option>`;
  }
}

class Golfer {}
class Course {
  constructor() {
    this.ID = 0;
    this.holeCount = 0;
    this.holes = [];
    this.name = "";
  }
  setCourse(ID) {
    this.ID = ID;
    console.log(this.ID);
    this.getCourseData(this.ID);
    this.holeCount = 0;
    this.holes = [];
    this.name = "";
  }
  async getCourseData(ID) {
    let url = "https://golf-courses-api.herokuapp.com/courses/" + ID;
    let rawData = await fetch(url);
    let jsonData = await rawData.json();
    console.log(jsonData.data);
    this.holeCount = jsonData.data.holeCount;
    this.name = jsonData.data.name;
    jsonData.data.holes.forEach((hole) => this.holes.push(hole));
    console.log(jsonData);
    this.render();
  }
  render() {
    document.querySelector("#courseName").innerHTML = this.name;

    let card = document.querySelector("#card");
    card.innerHTML = "";
    console.log(this.holes.length);

    let holeDOM = "";
    this.holes.forEach((hole, index) => {
      holeDOM += `<td>${index + 1} </td>`;
    });
    card.innerHTML += `<tr><td>Hole:</td> ${holeDOM}</tr>`;

    holeDOM = "";
    this.holes.forEach((hole, index) => {
      holeDOM += `<td>${hole.teeBoxes[0].par} </td>`;
    });
    card.innerHTML += `<tr><td>Par:</td> ${holeDOM}</tr>`;

    for (let i = 0; i < this.holes[0].teeBoxes.length; i++) {
      holeDOM = "";
      this.holes.forEach((hole, index) => {
        holeDOM += `<td>${hole.teeBoxes[i].yards} </td>`;
      });
      card.innerHTML += `<tr><td style="background:${this.holes[0].teeBoxes[i].teeHexColor}">${this.holes[0].teeBoxes[i].teeColorType}</td>${holeDOM}</tr>`;
    }
  }
}

let myCourse = new Course();
fetchCourses();
myCourse.setCourse(11819);

courseSelectDOM.addEventListener("change", (event) => {
  myCourse.setCourse(event.target.value);
});
