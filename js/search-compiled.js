/**
 * Created by ben7664 on 9/30/2015.
 */

'use strict';

window.onload = function () {

    var Observable = Rx.Observable;

    var textbox = document.getElementById('textbox');
    var results = document.getElementById('results');
    var searchButton = document.getElementById('searchButton');

    var keypresses = Observable.fromEvent(textbox, 'keypress');
    var searchButtonClicks = Observable.fromEvent(searchButton, 'click');

    var resultArray = [];

    var getCongressman = function getCongressman(term) {
        return Observable.create(function forEach(observable) {
            var cancelled = false;
            var url = "http://congress.api.sunlightfoundation.com/legislators/locate?apikey=9f64292279cc4c40aea72946979597a2&zip=" + encodeURIComponent(term);
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

        return keypresses.throttle(20).map(function (key) {
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
        });
    });

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