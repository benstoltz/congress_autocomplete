'use strict';

/**
 * Created by ben7664 on 9/30/2015.
 */

window.onload = function () {

    var Observable = Rx.Observable;

    var textbox = document.getElementById('textbox');
    var results = document.getElementById('results');
    var searchButton = document.getElementById('searchButton');

    var resultList = document.getElementById('resultList');

    var keypresses = Observable.fromEvent(textbox, 'keypress');
    var searchButtonClicks = Observable.fromEvent(searchButton, 'click');

    var nameList = [];

    var getAllCongressman = function getAllCongressman() {
        return Observable.create(function forEach(observable) {
            var cancelled = false;
            var url = "http://congress.api.sunlightfoundation.com/legislators?per_page=all&apikey=9f64292279cc4c40aea72946979597a2";
            $.getJSON(url, function (data) {
                if (!cancelled) {
                    observable.onNext(data.results);
                    observable.onCompleted();
                }
            });

            return function dispose() {
                cancelled = true;
            };
        });
    };

    getAllCongressman().forEach(function (resultSet) {
        resultSet.forEach(function (result) {
            nameList.push(result.first_name + " " + result.last_name);
        });
        new Awesomplete(textbox, { list: nameList });
        console.log(resultSet);
    });

    var getCongressman = function getCongressman(term) {
        return Observable.create(function forEach(observable) {
            var cancelled = false;
            var url = "http://congress.api.sunlightfoundation.com/legislators?query=" + encodeURIComponent(term) + "&apikey=9f64292279cc4c40aea72946979597a2";
            $.getJSON(url, function (data) {
                if (!cancelled) {
                    observable.onNext(data.results);
                    observable.onCompleted();
                }
            });

            return function dispose() {
                cancelled = true;
            };
        });
    };

    var searchFormOpens = searchButtonClicks.doAction(function onNext(v) {
        document.getElementById('searchForm').style.display = "block";
    });

    var searchResultSets = searchFormOpens.map(function () {
        var closeClicks = Observable.fromEvent(document.getElementById("closeButton"), 'click');
        var searchFormCloses = closeClicks.doAction(function () {
            return document.getElementById('searchForm').style.display = "none";
        });

        return keypresses.throttle(1200).map(function (key) {
            return textbox.value;
        }).distinctUntilChanged().map(function (search) {
            return getCongressman(search).retry(3);
        }).switchLatest().takeUntil(searchFormCloses);
    }).switchLatest();

    //
    //searchResultSets.forEach( (resultSet) => {
    //    console.log(resultSet);
    //    let names = resultSet.forEach( result => result.last_name);
    //
    //    return results.value = names
    //
    //});
    searchResultSets.forEach(function (resultSet) {
        resultSet.forEach(function (result) {
            results.value += result.first_name + " " + result.last_name + "\n";
            console.log(result);
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(result.first_name + " " + result.last_name + " | " + result.bioguide_id));
            resultList.appendChild(entry);
        });
    });

    //searchResultSets.forEach( (resultSet) => {
    //    resultSet.forEach( (result) => {
    //        nameList.push(result.first_name + " " + result.last_name);
    //        console.log(nameList);
    //    })
    //});

    //getCongressman('Leahy').forEach( (results) =>
    //        console.log(results)
    //);
    //
    //getCongressman('Leahy').forEach( (results) =>
    //        results.forEach( (result) =>
    //                console.log(result.last_name)
    //        )
    //)
};

//window.onload = function() {
//
//    var Observable = Rx.Observable;
//
//    var textbox = document.getElementById('textbox');
//
//    var results = document.getElementById('results');
//
//    var keypresses = Observable.fromEvent(textbox,     'keypress');
//
//    var searchButton = document.getElementById('searchButton');
//    var searchButtonClicks = Observable.fromEvent(searchButton, 'click');
//
//// keypresses.forEach(e => console.log(e.keyCode));
//
//
//    function getWikipediaSearchResults(term) {
//        return Observable.create(function forEach(observable) {
//            var cancelled = false;
//
//            var url = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + encodeURIComponent(term) + '&callback=?';
//
//            $.getJSON(url, function(data){
//                if (!cancelled) {
//                    observable.onNext(data[1]);
//                    observable.onCompleted();
//                }
//            });
//
//            return function dispose() {
//                cancelled = true;
//            };
//        });
//    }
//
//    var searchFormOpens = searchButtonClicks.doAction(
//        function onNext(v) {
//            document.getElementById('searchForm').style.display = "block";
//        });
//
//    var searchResultSets =
//        searchFormOpens.
//            map(function() {
//                var closeClicks = Observable.fromEvent(document.getElementById("closeButton"), 'click');
//                var searchFormCloses =
//                    closeClicks.doAction(function() {
//                        document.getElementById('searchForm').style.display = "none";
//                    });
//                return keypresses.
//                    throttle(20).
//                    map(function(key) {
//                        return textbox.value;
//                    }).
//                    distinctUntilChanged().
//                    map(function(search){
//
//                        return getWikipediaSearchResults(search).retry(3);
//                    }).switchLatest().
//                    takeUntil(searchFormCloses)
//            }).switchLatest();
//
//    searchResultSets.forEach(
//        function(resultSet) {
//            results.value = JSON.stringify(resultSet);
//            console.log(resultSet);
//        },
//        function(error){
//            console.log(error);
//        });
//
//    getWikipediaSearchResults('France').forEach(function(results){console.log(results); });
//
//
//}

//# sourceMappingURL=search-compiled.js.map