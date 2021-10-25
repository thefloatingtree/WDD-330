import Hikes from '../model/hikes.js'

const hikeList = [
    {
        name: "Bechler Falls",
        imgSrc: "https://byui-cit.github.io/cit261/examples/falls.jpg",
        imgAlt: "Image of Bechler Falls",
        distance: "3 miles",
        difficulty: "Easy",
        description:
            "Beautiful short hike along the Bechler river to Bechler Falls",
        directions:
            "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road.Drive to the end of the Cave Falls road. There is a parking area at the trailhead."
    },
    {
        name: "Teton Canyon",
        imgSrc: "https://byui-cit.github.io/cit261/examples/falls.jpg",
        imgAlt: "Image of Bechler Falls",
        distance: "3 miles",
        difficulty: "Easy",
        description: "Beautiful short (or long) hike through Teton Canyon.",
        directions:
            "Take Highway 33 East to Driggs. Turn left onto Teton Canyon Road. Follow that road for a few miles then turn right onto Staline Raod for a short distance, then left onto Alta Road. Veer right after Alta back onto Teton Canyon Road. There is a parking area at the trailhead."
    },
    {
        name: "Denanda Falls",
        imgSrc: "https://byui-cit.github.io/cit261/examples/falls.jpg",
        imgAlt: "Image of Bechler Falls",
        distance: "7 miles",
        difficulty: "Moderate",
        description:
            "Beautiful hike through Bechler meadows river to Denanda Falls",
        directions:
            "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road. Drive to until you see the sign for Bechler Meadows on the left. Turn there. There is a parking area at the trailhead."
    }
];

const hikes = hikeList.map(hikeData => new Hikes(hikeData))

function findNearestHikeElementName(element) {
    while (element.parentElement) {
        const hikeName = element.parentElement.getAttribute('data-hike-name');
        if (hikeName) return hikeName;
        element = element.parentElement;
    }
    return null;
}

//on load grab the array and insert it into the page
window.addEventListener("load", () => {
    mainView();

    window.addEventListener('click', (event) => {
        // onclick, remove all content and render only one list item
        const hikeName = findNearestHikeElementName(event.target)
        if (hikeName) detailedView(hikeName)
    });
});

function detailedView(hikeName) {
    const hike = hikes.find(hike => hike.name === hikeName)
    const hikeHTML = hike.renderDetailed()
    showView([ hikeHTML ])
}

function mainView() {
    const hikesHTML = makeHikeList(hikes);
    showView(hikesHTML);
}

function makeHikeList(hikes) {
    return hikes.map(hike => hike.render())
}

function showView(HTMLList) {
    const element = document.getElementById("hikes");
    element.innerHTML = "";
    HTMLList.forEach(HTMLString => {
        element.insertAdjacentHTML('beforeend', HTMLString);
    });
}