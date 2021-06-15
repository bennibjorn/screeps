interface Visual {
    [key: string]: {
        color: string;
        lineStyle: "dashed" | "dotted" | "solid";
    };
}

export const pathVisuals: Visual = {
    harvest: {
        color: "#E10101",
        lineStyle: "dashed"
    },
    deposit: {
        color: "#16E050",
        lineStyle: "solid"
    },
    build: {
        color: "#00EEFF",
        lineStyle: "dotted"
    },
    upgrade: {
        color: "#0B1EE0",
        lineStyle: "solid"
    },
    outOfTheWay: {
        color: "#E0B516",
        lineStyle: "dotted"
    }
};
