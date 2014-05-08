window.PoohSticks = {
    Config: {
        OutcomeFadeInStart: 4,
		MinRetrysForHelp: 4
    },
	WinningOutcome: 'MeanderingChannelWithCutOffs',
    Attempts: 0,
    Outcomes: [
        { 
            id: 'ChainOfPonds',
            title: 'a ‘Chain of ponds’',
            html: '<p>This is a discontinuous channel so your stick got stuck in the ponds and slowed its progress – think about trying to create a continuous channel by increasing its energy?</p>',
			time: '30:00'
        },
        { 
            id: 'ChanelWithFloodout',
            title: 'a channel with a ‘floodout’',
            html: '<p>This is a discontinuous channel so your stick was slowed then got stuck in the marshes– think about trying to create a continuous channel by increasing its energy?</p>',
			time: '25:00'
        },
        {
            id: 'AnastomisingChannel',
            title: 'an anastomosing channel',
            html: '<p>Your stick was diverted by the numerous anabranching channels that dissect from the main channel– try to reduce the rivers ability to split from its trunk channel by increasing its energy?</p>',
			time: '20:00'
        },
        {
            id: 'AnabranchingRiver',
            title: 'an anabranching river',
            html: '<p>Your stick was diverted by the numerous anabranching channels that dissect from the main channel– try to reduce the rivers ability to split from its trunk channel by increasing its energy?</p>',
			time: '20:00'
        },
        {
            id: 'FineGrainedMeanderingRiver',
            title: 'a fine grained meandering river',
            html: '<p>Your stick was initially fast with no in-channel bars to obstruct its progress but was slightly slowed by large point bars on each meander – try to reduce the number of depositional features and meanders by increasing its energy?</p>',
			time: '15:00'
        },
        {
            id: 'CoarseGrainedMeanderingRiver',
            title: 'a coarse grained meandering river',
            html: '<p>Your stick was fast with no in-channel bars to obstruct its progress but was slightly slowed by the number and size of meanders – try to reduce the number of meanders by increasing its energy?</p>',
			time: '10:00'
        },
        {
            id: 'MeanderingChannelWithCutOffs',
            title: 'a meandering channel with many cut-offs',
            html: '<p><strong>Conratulations, you won in {0}!</strong> Initially your stick was slowed by the meanders but then it took a short cut down the numerous cut-offs and dramatically increased in speed – your stick won the race!!</p>',
			time: '5:00'
        },
        {
            id: 'WanderingGravelBed',
            title: 'a wandering gravel bed',
            html: '<p>This is a high energy channel so initially your stick travelled very fast but then got stuck on the wandering gravel bed  in the central reach and slowed its progress – think about trying to reduce gravel bars in the channel by reducing its energy.</p>',
			time: '15:00'
        },
        {
            id: 'BraidedRiver',
            title: 'a braided river',
            html: '<p>This is a high energy channel so initially your stick travelled very fast but then got stuck on the numerous sand bars and slowed its progress – think about trying to reduce the number of bars in the channel by reducing its energy?</p>',
			time: '20:00'
        },
        {
            id: 'SteepPoolsAndCascades',
            title: 'steep pools and cascades',
            html: '<p>This is a high energy erosive channel formed in bedrock so your stick got trapped in the high energy pools and slowed its progress – think about trying to create a more even channel by reducing its energy?</p>',
			time: '25:00'
        }
    ],
    ResetValues: function () {
        window.PoohSticks.Values = undefined;

        $('#gradient').slider("value", 0);
        $('#discharge').slider("value", 0);
        $('#sedimentload').slider("value", 0);
    },
    CalculateEndResult: function() {
        var data = window.PoohSticks.DataPoints,
            vals = window.PoohSticks.Values;

        if (vals) {
            return data[vals.gradient][vals.discharge][vals.sedimentload];
        }

        return undefined;
    },
    Values: undefined,
    RunEndSequence: function ($endSlide, params) {
        var $content = $endSlide.find('#outcome-panel');
        var resultIndex = parseInt(window.PoohSticks.CalculateEndResult()) - 1;
        var sliderIndex = resultIndex;
        var outcome = window.PoohSticks.Outcomes[resultIndex]
        var $video = $endSlide.find('#outcome-video');
        $video.prop('src', 'Content/videos/outcomes/' + outcome.id + '.mov');

        window.PoohSticks.Attempts++;

        $content.hide();
        $content.find('#outcome-image').prop('src', './Content/images/outcomes/' + outcome.id + '.png');
        $content.find('#outcome-title').text(outcome.title);
        $content.find('#outcome-html').html(outcome.html.replace('{0}', window.PoohSticks.Attempts.toString() + (window.PoohSticks.Attempts > 1 ? ' attempts' : ' attempt')));
        $('#result-pointer').appendTo($content.find('#result-table tbody tr td').eq(sliderIndex));

        if (outcome.id == window.PoohSticks.WinningOutcome) {
            window.PoohSticks.Attempts = 0;
        }

        $video.on('ended', function () {
            $content.show();
        });

        $video.show();
        $video[0].play();

        $video.on('timeupdate', function updateTime () {
            var flagged = false;
            var seconds = PoohSticks.Config.OutcomeFadeInStart;

            var timerFunction = {}

            return function () {
                if (!flagged)
                {
                    if (this.currentTime > (this.duration - seconds)) {
                        this.removeEventListener("timeupdate", updateTime, false);
                        $content.fadeIn(seconds * 1000, function () {
                            $('.slides-navigation a').hide();

                            if (outcome.id == window.PoohSticks.WinningOutcome) {
                                $('.slides-navigation .new').show();
                            }
                            else {
                                $('.slides-navigation .re-try').show();
								
								if(
									window.PoohSticks.Attempts >= window.PoohSticks.Config.MinRetrysForHelp
								)
								{
									$('.slides-navigation .help').show();
								}
                            }
                        });

                        flagged = true;
                    }
                }
            }
        }());
    }
}