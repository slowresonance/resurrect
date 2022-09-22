import "./styles/style.css";
import { useState, useEffect } from "react";

const dateToYMD = (date) => {
  var strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var d = date.getDate();
  var m = strArray[date.getMonth()];
  var y = date.getFullYear();
  return "" + (d <= 9 ? "0" + d : d) + "-" + m + "-" + y;
};

const getFile = (event) => {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    placeFileContent(document.getElementById("content-target"), input.files[0]);
  }
};

function placeFileContent(target, file) {
  readFileContent(file)
    .then((content) => {
      let links = content.split(/\r?\n/);
      for (let i = 0; i < links.length; i++) {
        console.log(`${i}.opened ${links[i]} out of ${links.length}`);
        chrome.tabs.create({ url: links[i] }, () => {});
      }
    })
    .catch((error) => console.log(error));
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

const exportTabs = (text, links) => {
  const filename =
    text === "" ? `tabs-${dateToYMD(new Date())}.txt` : `${text}.txt`;
  console.log(filename);
  const blob = new Blob([links], {
    type: "text/json",
  });

  console.log(blob);
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(event);
  link.remove();
};

export default function App() {
  const [toggle, setToggle] = useState(true);
  const [tabsArray, setTabsArray] = useState([]);

  useEffect(() => {
    console.log("I loaded");
    // chrome.tabs.query({}, (tabs) => {
    //   let currentTabs = [];
    //   for (let i = 0; i < tabs.length; i++) {
    //     currentTabs.push(tabs[i].url);
    //   }
    //   setTabsArray(currentTabs);
    // });
  }, []);

  const flip = () => {
    setToggle(!toggle);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      exportTabs(e.target.value, tabsArray.join("\n"));
      setToggle(!toggle);
    }
  };

  const handleBlur = () => {
    setToggle(!toggle);
  };

  return (
    <div id="app-container">
      <div id="later">
        {toggle ? (
          <div id="avada-kedavra" onClick={flip}>
            save tabs for later
          </div>
        ) : (
          <input
            autoFocus
            type="text"
            placeholder="Save file as"
            id="file-name-input"
            onKeyDown={handleEnter}
            onBlur={handleBlur}
          />
        )}
      </div>

      <div id="divider">
        <svg
          width="2"
          height="40"
          viewBox="0 0 2 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 0V40" stroke="#444444" />
        </svg>
      </div>
      <div id="resurrect">
        <label>
          <input
            onChange={getFile}
            type="file"
            style={{ display: "none" }}
            id="file-input"
          />
          resurrect tabs
        </label>
      </div>
    </div>
  );
}
