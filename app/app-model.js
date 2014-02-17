var app;
document.querySelector('#search_field').blur();
Refuel.define('TVSApp',{require: ['GenericModule', 'ListModule', 'DataSource', 'SaytModule','ScrollerModule', 'ajax']},
    function TVSApp() {  
        Modernizr.Detectizr.detect();
        document.body.focus();
        var sxtitle = document.querySelector('#sx-title');
        var apiUrl = 'http://app.tvshowmark.it/api/v1/';
        var topUrl =    apiUrl+'tvshow/top/';
        var searchUrl = apiUrl+'tvshow/search/';
        var jsearchUrl =apiUrl+'tvshow/jsearch/';
        var userUrl =   apiUrl+'user/';
        var dashboardUrl=apiUrl+'user/dashboard/';
        var zoomUrl = apiUrl+'tvshow/'

        
        app = Refuel.newModule('GenericModule', {
            root: document.querySelector("body")
            ,autoload: true            
            ,data:  {
                //'top': Refuel.newModule('DataSource', { 
                //    url: 'http://app.tvshowmark.it/api/v1/tvshow/top/', 
                //    timeout: 100,
                //    timeoutCallback: function(e) {console.log('Top timeout error',e);}
                //}),
                'user': Refuel.newModule('DataSource', { url: userUrl, allowedStatus: [403] })
            }
            ,searchSayt: {
                url: jsearchUrl
                ,dataPath: 'results'
                ,delay: 200
                ,minChars: 2
                ,enableKeySelection: false
            }
            ,top: { rowStyle: ['series-row-A', 'series-row-B'] }
            ,dashboard: { rowStyle: ['series-row-A', 'series-row-B'] }
            ,zoom: { 
                seasons: { 
                    rowStyle: ['seasons-row-A', 'seasons-row-B'] 
                } 
            }
        });
        app.currentState = {};
        var currentSeason;
        var top = app.items['top'];
        var sayt = app.items['searchSayt'];
        var zoom = app.items['zoom'];
        var dashboard = app.items['dashboard'];
        var dashboard_ds = dashboard.dataSource;

        var loadingDiv = document.querySelector("#searchProgLoading");
        var dashboardHTMLElement = document.querySelector('#dashboard');
        
        function topCallback(e) {
            //IN questa maniera chiunque arrivi con una risposta diventa DS di TOP, non è top a scegliere
            switch(e.url) {
                case topUrl:
                    top.mode = 'top'; 
                    sxtitle.textContent = 'Top of the Week';
                break;
                case searchUrl:
                    top.mode = 'search';  
                    sxtitle.textContent = 'Results for "'+search.currentQuery+'"';
                break;
                default:
                    top.mode = 'similar';  
                break;
            }
            if (!e.responseJSON.previous) this.page = 1;
            this.next = e.responseJSON.next ? true : false;
            top.data = this.getData();
        }

        ///  LIST DATASOURCES ///
        var search =  Refuel.newModule('DataSource', { url: searchUrl, dataPath: 'results', successCallback: topCallback
            ,errorCallback: function(e) {
                console.error(e);
                setLoadingList(false);
                setLoadingState(top.root, false);
            }
        });
        var similar =  Refuel.newModule('DataSource', {dataPath: 'results', successCallback: topCallback});
        var topShows =  Refuel.newModule('DataSource', { url: topUrl, dataPath: 'results',successCallback: topCallback});
        topShows.load();

        dashboard_ds.setConfig({
            successCallback: function(e) {
                if (!e.responseJSON.previous) dashboard_ds.page = 1;
                dashboard_ds.next = e.responseJSON.next ? true : false;
            }
        });

        app.loadTop = function() {
            if (top.mode != 'top') topShows.load();
        }
        
        app.loadZoom = function(id) {
            if (zoom.data.tvdb_id == id) return;
            zoom.dataSource.load({'url': zoomUrl+id});
            similar.load({'url': zoomUrl+id+'/similar/'});
            setSplash();
        }
        app.loadDashboard = function(section) {
            setLoadingState(dashboardHTMLElement, true); 
            var url = dashboardUrl+section+'/';
            dashboardHTMLElement.classList.remove(dashboard.currentSection);
            dashboardHTMLElement.classList.add(section);
            dashboard.currentSection = section;
            dashboard.dataSource.load({'dataPath':'results','url': url});
        }
        app.loadSearch = function(q) {
            search.currentQuery = q;
            setLoadingState(top.root);
            search.load({
                url: searchUrl,
                params: 'q='+search.currentQuery, 
            });
            sayt.elements['inputField'].blur();
            clearSayt();
        }


        function clearSayt() {
            sayt.dataSource.abort();
            sayt.elements['inputField'].value = '';
            sayt.dataSource.clear();
            sayt.hide();
        }
        
        sayt.defineAction('clearSayt', function(e) {
            if (this.elements['inputField'].value.length> 1 ) {
                clearSayt();
                app.loadTop();
            }
        });

        sayt.elements['inputField'].addEventListener('blur', function() {
            document.querySelector('section#search').classList.remove('obscured');
        });
        sayt.elements['inputField'].addEventListener('focus', function() {
            document.querySelector('section#search').classList.add('obscured');
        });
        sayt.elements['inputField'].addEventListener('keypress', function(e) {
            if (e.keyCode == 13) document.location.hash = '/0/search/'+this.value.trim();
        });

        app.subscribe('drawComplete', function() { 
            document.location.hash = '/1/home';
            setLoadingState(app.template.getRoot(), false);
            setSplash(false);
            if(this.data.user.data['is_active']) {
                app.loadDashboard('watching');
                document.body.classList.add('logged');
            } else {
                //document.location.href= "/api/v1/auth/login/appsfuel/?next=/";
                document.body.classList.add('unlogged');
            }
            top.scroller = Refuel.newModule('ScrollerModule', {rootId: 'search_list_wrappper', topMargin: 72});
            top.scroller.subscribe('lowerBoundReached', function(e) {
                //quando la lista in top deve fare next... bisogna sapere se è search, top o similar
                if (top.mode === 'top' && topShows.next) {
                    topShows.page++;
                    topShows.load({params: 'page='+topShows.page, mode: 'add'});
                }
                else if (top.mode == 'search' && search.next) {
                    search.page++;
                    search.load({params: 'q='+search.currentQuery+'&page='+search.page, mode: 'add'});
                }
                else if (top.mode == 'similar' && similar.next) {
                    similar.page++;
                    similar.load({params: 'page='+similar.page, mode: 'add'});
                }
            });
        });

        app.defineAction('returnHome', function(){
            document.location.hash = '/1/home';
        });

        zoom.defineAction('info', function(e) {
            if (!e.module.data.overview) return;
            zoom.querySelector('.series-info > .overview').innerHTML = e.module.data.overview;
            zoom.querySelector('.series-info').classList.toggle('hide');
            zoom.scroller.moveTo(0, 10);
        });

        zoom.subscribe('drawComplete', function() {
            setSplash(false);
            sxtitle.textContent = 'Similar to "'+zoom.data.title+'"';
            setLoadingState(app.template.getRoot(), false);
            if (zoom.scroller) zoom.scroller.destroy();
            zoom.scroller = Refuel.newModule('ScrollerModule', {rootId: 'zoom'});
            zoom.getModule('seasons').applyOnItems(function(season) {
                updateSeason(season);
            });
        });

        dashboard.subscribe('drawComplete', function() {
            setLoadingState(dashboardHTMLElement, false);

            if (dashboard.scroller) dashboard.scroller.destroy();
            dashboard.scroller = Refuel.newModule('ScrollerModule', {rootId: 'dashboard_wrapper', topMargin:109});
            dashboard.scroller.subscribe('lowerBoundReached', function(e) {
                if (dashboard_ds.next) {
                    dashboard_ds.page++;
                    dashboard_ds.load({params: 'page='+dashboard_ds.page, mode: 'add'});
                } 
            });
        });

        zoom.items.seasons.subscribe('loadComplete', function(e) {
            var totalEpisodes = 0;
            for (var i=0, season; season = this.data[i]; i++) {
                for (var n=0, ep; ep = season.episodes[n]; n++) {
                    totalEpisodes++; 
                    if(!ep.aired && ep.first_aired) {
                        var date = convertToDate(ep.first_aired);
                        ep.onAirDate = date.moment;//date.day + '/' + date.month + '/' + date.year;
                    }          
                }
            }
            zoom.data.totalEpisodes = totalEpisodes;
        });

        zoom.items.seasons.subscribe('drawComplete', function() {
            var i=0;
            this.applyOnItems(function(item) {
                expandSeason(item, false);
                i++;
            });
        })

        zoom.items.seasons.defineAction('expandSeason', function(e) {
            var wasclosed = e.module.root.classList.contains('closed');
            
            this.applyOnItems(function(item) {
                expandSeason(item, false);
            });
            var yy = 0;
            if (wasclosed) {
                expandSeason(e.module, true);
                yy = e.currentTarget.offsetTop-50;
            }
            if (zoom.scroller) zoom.scroller.destroy();
            zoom.scroller = Refuel.newModule('ScrollerModule', {rootId: 'zoom'});
            zoom.scroller.moveTo(-yy, 10);
        });

        function expandSeason(item, expand) {
            item.toggleClass('closed', !expand);
            item.toggleClass('opened', expand);
        }

        function updateSeason(season) {
            var nEpisodes = 0;//season.data.episodes.length;
            var nwEpisodes = season.data.user.watched_episodes;

            for (var i = 0, ep; ep = season.data.episodes[i]; i++) {
                if(ep.aired) nEpisodes++;
            }
            season.classList.remove('watched8');
            season.classList.remove('started');
            season.classList.remove('notairedyet');
            if (!nEpisodes) {
                season.classList.add('notairedyet');
            }
            else if (nEpisodes == nwEpisodes) {
                season.classList.add('watched');
            }
            else if (nwEpisodes > 0) {
                season.classList.add('started');
            }

            updateZoom();
            return nEpisodes == nwEpisodes
        }

        function updateZoom(status) {
            if (!zoom.data.user.watched_episodes && zoom.data.user.status != 'Planned') {
                zoom.data.user.status = null;
            }
            else if ( (zoom.data.totalEpisodes === zoom.data.user.watched_episodes) && zoom.data.status == 'Ended') {
                zoom.data.user.status = 'Completed';
            }
            else if (zoom.data.user.watched_episodes) {
                zoom.data.user.status = 'Watching';
            }
            zoom.root.className = zoom.data.user.status || 'no-state';
            
        }

        function watchEpisode(season, dontupdate) {
            if (!this.data.aired || this.data.user.watched) return null;
            if (!season) season = this.parentModule.parentModule;zoom
            season.data.user.watched_episodes++;
            zoom.data.user.watched_episodes++;
            if (!dontupdate) {
                updateSeason(season);
            } 
            this.data.user.status = 'Watching';
            this.data.user.watched = new Date().getTime();
            return this.data.tvdb_id;
        }

        function unwatchEpisode(season, dontupdate) {
            if (!this.data.aired || !this.data.user.watched) return null;
            if (!season) season = this.parentModule.parentModule;
            season.data.user.watched_episodes--;
            zoom.data.user.watched_episodes--;
            if (!dontupdate) { 
                updateSeason(season);
            }
            this.data.user.watched = null;
            this.data.user.status = null;
            return this.data.tvdb_id;
        }

        zoom.defineAction('watchEpisode', function(e) {
            var action = 'watch';
            if (!e.module.data.user.watched) {
                watchEpisode.call(e.module);
            }
            else {
                unwatchEpisode.call(e.module);
                action = 'unwatch';
            }
            actionOn.call(e.module, action);
        });

        zoom.defineAction('watchSeason', function(e) {
            var action = 'watch';
            //2 methods to know if a series already finished
            //e.module.classList.contains('watched')
            //e.module.data.episodes.length == e.module.data.user.watched_episodes
            if (e.module.classList.contains('watched')) {
                action = 'unwatch';
            } 
            var data = e.module.data;
            var nwatched = data.user.watched_episodes;
            var episodes = e.module.getModule('episodes');
            var idlist = [];
            var season = episodes.parentModule;
            episodes.applyOnItems(function(item) {
                var id = action == 'watch' ? watchEpisode.call(item, season, true) : unwatchEpisode.call(item, season, true);
                if (id) idlist.push(id);
            });
            updateSeason(season);
            actionOn.call(e.module, action, idlist);
        });

        app.defineAction('watch', function(e) {
            e.module.data.user.status = 'Watched';
            actionOn.call(e.module, 'watch');
            e.module.data.user.watched = new Date().getTime();
        });
        app.defineAction('plan', function(e) {
            e.module.data.user.status = 'Planned';
            if (zoom.data && e.module.data.tvdb_id === zoom.data.tvdb_id ) zoom.data.user.status = 'Planned';
            actionOn.call(e.module, 'plan');
        });
        app.defineAction('drop', function(e) {
            e.module.data.user.status = 'Dropped';
            actionOn.call(e.module, 'drop');
        });

        app.defineAction('alertPurge', function(e) {
            document.querySelector('#alert').classList.remove('hide');
        }); 
        app.defineAction('purge', function(e) {
            e.module.data.user.status = 'null';
            actionOn.call(e.module, 'purge');
        });

        app.defineAction('showDashboardWatched', function(e) {
            document.location.hash = '/2/dashboard/watching';
        });
        app.defineAction('showDashboardPlanned', function(e) {
            document.location.hash = '/2/dashboard/planned';
        });
        app.defineAction('showDashboardHistory', function(e) {
            document.location.hash = '/2/dashboard/archived';
        });

        app.defineAction('showContext', function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.module.classList.add('showContext');
            setTimeout(function() {
                e.module.classList.remove('showContext');
            } ,5000)
        });
        app.defineAction('hideContext', function(e) {
             e.module.classList.remove('showContext');
        });

        app.defineAction('showZoom', function(e) {
           if(e.module.classList.contains('showContext')) return;
           document.location.hash = '/1/zoom/'+e.module.data.tvdb_id;
        });

        function actionOn(action, idlist) {
            var self = this;
            var ids = idlist || [this.data.tvdb_id];

            var csrftoken = Refuel.cookie.get('csrftoken');
            var url = userUrl+action+'/';
            var body = {'tvdb_id': ids};
        
            Refuel.ajax.post(url, JSON.stringify(body), {
                headers: {'X-CSRFToken': csrftoken},
                successCallback: function(ev) {
                    setLoadingState(ev.target, false);
                    dashboard.reload();
                },
                errorCallback:  function(ev) {
                    setLoadingState(ev.target, false);
                }
            });
        }

        var loader = document.querySelector('.loading-layer');
        var splash = document.querySelector('.splash-layer');

        function setLoadingState(element, active, msg) {
            if (active === undefined) active = true;
            if (loader.parentNode) loader.parentNode.removeChild(loader);
            if (msg === undefined) msg = '...loading wait...';
            loader.querySelector('.wait-message').innerHTML = msg;

            if (element) element.appendChild(loader);
            active ? loader.classList.remove('hide') : loader.classList.add('hide');
        }

        function setLoadingList(active) {    
            if (active === undefined) active = true;        
            setLoadingState(loadingDiv, active, '');
            active ? loadingDiv.classList.remove('hide') : loadingDiv.classList.add('hide');
        }

        function setSplash(active) {
            if (active === undefined) active = true;
            active ? splash.classList.remove('hide') : splash.classList.add('hide');
        }

        function convertToDate(timestamp) {
            var date = new Date(timestamp * 1000);
            var obj = { 
                year: date.getFullYear(),
                month: date.getMonth()+1,
                day: date.getDate(),
                hh: date.getHours(),
                mm: date.getMinutes()
            };
            moment.lang('en', {
                calendar : {
                    lastDay : '[Yesterday at] LT',
                    sameDay : '[Today at] LT',
                    nextDay : '[Tomorrow at] LT',
                    lastWeek : '[last] dddd',
                    nextWeek : '[next] dddd',
                    sameElse : 'L'
                }
            });
            obj.moment = moment(date).calendar();//fromNow();
            return obj;
        }

        Path.root('/1/home');
        Path.map("#/:pane(/:action)(/:params)").to(function() {
            carousel.showPane(parseInt(this.params['pane']));
            var pane;
            if (this.params['action']) {
                switch(this.params['action']) {
                    case 'top':
                        app.loadTop();
                    break;
                    case 'search':
                        app.loadSearch(this.params['params']);
                    break;
                    case 'similar':
                        document.body.classList.add('zoom');
                    break;
                    case 'home':
                        pane = 1;
                        app.loadTop();
                        document.body.classList.remove('zoom');
                    break;
                    case 'zoom':
                        if (this.params['params']) app.loadZoom(this.params['params']);
                        document.body.classList.add('zoom');
                    break;
                    case 'dashboard':
                        app.loadDashboard(this.params['params']);
                    break;
                }    
            }
            app.currentState.pane = this.params['pane'];
            app.currentState.action = this.params['action'];
            app.currentState.params = this.params['params'];
        });
    }
);