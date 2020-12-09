function getDisease(diseaseName) {
    if (diseaseName === "COVID19"){
        // @todo Update these values periodically. Original source was COVID Wiki article.
        return new Disease(0.2, 0.123, 0.035, 6, 10); 
    }
    return new Disease(0.25, 0.5, 0.25, 0.6, 1);  
}