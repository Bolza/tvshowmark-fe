 app.controller(
            "AppController",
            function( $scope ) {

                $scope.isBoxVisible = true;

                $scope.photos = buildPhotoSet( 200 );
                $scope.changeSource = function() {
 
                    var now = ( new Date() ).getTime(
                    for ( var i = 0 ; i < $scope.photos.length ; i++ ) {
 
                        var photo = $scope.photos[ i ];
 
                        photo.src = photo.src.replace( /\d\./i, "1." );
 
                    }
 
                };
                $scope.clearPhotos = function() {
 
                    $scope.photos = [];
 
                };
                $scope.hideBox = function() {
 
                    $scope.isBoxVisible = false;
 
                };
                $scope.rebuildSet = function() {
 
                    $scope.photos = buildPhotoSet( 20 );
 
                };
                function buildPhotoSet( size ) {
 
                    var photos = [];
                    var now = ( new Date() ).getTime();
 
                    for ( var i = 0 ; i < size ; i++ ) {
 
                        var index = ( ( i % 3 ) + 1 );
                        var version = ( now + i );
 
                        photos.push({
                            id: ( i + 1 ),
                            src: ( "christina-cox-" + index + ".jpg?v=" + version )
                        });
 
                    }
 
                    return( photos );
 
                }
 
            }
        
        app.directive(
            "bnLazySrc",
            function( $window, $document ) {
                var lazyLoader = (function()
                    var images = [
                    var renderTimer = null;
                    var renderDelay = 10
                    var win = $( $window 
                    var doc = $document;
                    var documentHeight = doc.height();
                    var documentTimer = null;
                    var documentDelay = 200
                    var isWatchingWindow = false;
                    function addImage( image ) {
                        images.push( image );
                        if (!renderTimer) startRenderTimer();
                        if (!isWatchingWindow) startWatchingWindow();
                    }
                    function removeImage( image ) {
                        for ( var i = 0 ; i < images.length ; i++ ) {
                            if ( images[ i ] === image ) {
                                images.splice( i, 1 );
                                break;
                            }
                        }
                        if ( ! images.length ) {
                            clearRenderTimer();
                            stopWatchingWindow();
                        }
                    }
                    function checkDocumentHeight() {
                        if ( renderTimer ) return;
                        var currentDocumentHeight = doc.height();
                        if ( currentDocumentHeight === documentHeight )  return;
                        documentHeight = currentDocumentHeight;
                        startRenderTimer();
                    }
                    function checkImages() {
                        console.log( "Checking for visible images..." );
                        var visible = [];
                        var hidden = [];
                        var windowHeight = win.height();
                        var scrollTop = win.scrollTop();
                        var topFoldOffset = scrollTop;
                        var bottomFoldOffset = ( topFoldOffset + windowHeight );
                        for ( var i = 0 ; i < images.length ; i++ ) {
                            var image = images[ i ];
                            if ( image.isVisible( topFoldOffset, bottomFoldOffset ) ) {
                                visible.push( image );
                            } else {
                                hidden.push( image );
                            }
                        }
                        for ( var i = 0 ; i < visible.length ; i++ ) {
                            visible[ i ].render();
                        }
                        images = hidden;
                        clearRenderTimer();
                        if ( ! images.length ) {
                            stopWatchingWindow();
                        }
                    }
                    function clearRenderTimer() {
                        clearTimeout( renderTimer );
                        renderTimer = null;
                    }
                    function startRenderTimer() {
                        renderTimer = setTimeout( checkImages, renderDelay );
                    }
                    function startWatchingWindow() {
                        isWatchingWindow = true;
                        win.on( "resize.bnLazySrc", windowChanged );
                        win.on( "scroll.bnLazySrc", windowChanged );
                        documentTimer = setInterval( checkDocumentHeight, documentDelay );
                    }
                    function stopWatchingWindow() {
                        isWatchingWindow = false;
                        win.off( "resize.bnLazySrc" );
                        win.off( "scroll.bnLazySrc" );
                        clearInterval( documentTimer );
                    }
                    function windowChanged() {
                        if ( ! renderTimer ) {
                            startRenderTimer();
                        }
                    }
                    return({
                        addImage: addImage,
                        removeImage: removeImage
                    });
 
                })();
                function LazyImage( element ) {
                    var source = nul
                    var isRendered = fals
                    var height = null;
                    function isVisible( topFoldOffset, bottomFoldOffset ) {
                        if ( ! element.is( ":visible" ) ) {
 
                            return( false );
 
                        }
                        if ( height === null ) {
 
                            height = element.height();
 
                        }
                        var top = element.offset().top;
                        var bottom = ( top + height );
                        return(
                                (
                                    ( top <= bottomFoldOffset ) &&
                                    ( top >= topFoldOffset )
                                )
                            ||
                                (
                                    ( bottom <= bottomFoldOffset ) &&
                                    ( bottom >= topFoldOffset )
                                )
                            ||
                                (
                                    ( top <= topFoldOffset ) &&
                                    ( bottom >= bottomFoldOffset )
                                )
                        );
 
                    }
                    function render() {
                        isRendered = true;
                        renderSource();
                    }
                    function setSource( newSource ) {
                        source = newSource;
                        if ( isRendered ) {
                            renderSource();
                        }
                    }
                    function renderSource() {
                        element[ 0 ].src = source;
                        element.fadeTo('slow', 1);
                    }
                    return({
                        isVisible: isVisible,
                        render: render,
                        setSource: setSource
                    });
                }
                function link( $scope, element, attributes ) {
 
                    var lazyImage = new LazyImage( element 
                    lazyLoader.addImage( lazyImage );
                    attributes.$observe(
                        "bnLazySrc",
                        function( newSource ) {
 
                            lazyImage.setSource( newSource );
 
                        }
                    );
                    $scope.$on(
                        "$destroy",
                        function() {
 
                            lazyLoader.removeImage( lazyImage );
 
                        }
                    );
 
                }
                return({
                    link: link,
                    restrict: "A"
                });
 
            }
        );