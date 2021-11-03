const courseSelectDOM = document.querySelector("#courseSelect");

async function fetchCourses() {
  let url = "https://golf-courses-api.herokuapp.com/courses";
  let rawData = await fetch(url);
  let jsonData = await rawData.json();

  for (course of jsonData.courses) {
    courseSelectDOM.innerHTML += `<option value="${course.id}">${course.name}</option>`;
  }
}

class Golfer {
  constructor() {
    this.name = "";
    this.score = [];
  }
  setName(name) {
    this.name = name;
  }
  setScore(index, score) {
    this.score[index] = score;
  }
}
class Course {
  constructor() {
    this.ID = 0;
    this.holeCount = 0;
    this.holes = [];
    this.name = "";

    this.activeHole = 1;
    this.players = [new Golfer(), new Golfer(), new Golfer(), new Golfer()];
  }
  setPlayerName(index, name) {
    this.players[index].setName(name);
    this.render();
  }
  setPlayerScore(index, score) {
    this.players[index].setScore(this.activeHole - 1, score);
    this.render();
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
    this.holeCount = jsonData.data.holeCount;
    this.name = jsonData.data.name;
    jsonData.data.holes.forEach((hole) => this.holes.push(hole));
    this.render();
  }
  render() {
    //Render course and hole information
    document.querySelector("#courseName").innerHTML = this.name;
    document.querySelector("#holeNumber").innerHTML = `Hole: ${this.activeHole}`;
    document.querySelector("#thisPar").innerHTML = `Par: ${this.holes[this.activeHole - 1].teeBoxes[0].par}`;
    document.querySelector("#teeBoxes").innerHTML = "";
    this.holes[this.activeHole - 1].teeBoxes.forEach((tee) => {
      document.querySelector("#teeBoxes").innerHTML += `<li class="tee">${tee.teeColorType}:${tee.yards} yards</li>`;
    });
    document.querySelector("#handicap").innerHTML = "Handicap: " + this.holes[this.activeHole - 1].teeBoxes[0].hcp;

    //Renders scorecard
    let card = document.querySelector("#card");
    card.innerHTML = "";

    let rowHTMLin = "";
    let rowHTMLout = "";

    //Hole Number
    for (let i = 0; i < 9; i++) {
      rowHTMLin += `<td>${i + 1}</td>`;
    }
    for (let i = 9; i < 18; i++) {
      rowHTMLout += `<td>${i + 1}</td>`;
    }
    let rowHTML = `<tr><td>Hole:</td>${rowHTMLin}<td>OUT</td>${rowHTMLout}<td>IN</td><td>Total</td></tr>`;
    card.innerHTML += rowHTML;

    //Teeboxes
    console.log(this.holes[this.activeHole - 1]);
    this.holes[0].teeBoxes.forEach((tee, index) => {
      rowHTMLin = "";
      rowHTMLout = "";

      for (let i = 0; i < 9; i++) {
        rowHTMLin += `<td>${this.holes[i].teeBoxes[index].yards}</td>`;
      }
      for (let i = 9; i < 18; i++) {
        rowHTMLout += `<td>${this.holes[i].teeBoxes[index].yards}</td>`;
      }
      rowHTML = `<tr><td>${tee.teeColorType}</td>${rowHTMLin}<td></td>${rowHTMLout}<td></td><td></td></tr>`;
      card.innerHTML += rowHTML;
    });

    //Player names and scores
    this.players.forEach((player, index) => {
      console.log(player);
      rowHTMLin = "";
      rowHTMLout = "";

      let outScore = 0;
      for (let i = 0; i < 9; i++) {
        rowHTMLin += `<td>${player.score[i] || ""}</td>`;
        outScore += parseInt(player.score[i] || 0);
      }

      let inScore = 0;
      for (let i = 9; i < 18; i++) {
        rowHTMLout += `<td>${player.score[i] || ""}</td>`;
        inScore += parseInt(player.score[i] || 0);
      }
      rowHTML = `<tr><td>${player.name || "Player " + (index + 1)}</td>${rowHTMLin}<td>${outScore}</td>${rowHTMLout}<td>${inScore}</td><td>${inScore + outScore}</td></tr>`;
      card.innerHTML += rowHTML;
    });
  }
  nextHole() {
    this.activeHole++;
    this.render();
  }
  previousHole() {
    this.activeHole--;
    this.render();
  }
}

let myCourse = new Course();
fetchCourses();
myCourse.setCourse(11819);

courseSelectDOM.addEventListener("change", (event) => {
  myCourse.setCourse(event.target.value);
});
