$('a[href="' + this.location.pathname + '"]').addClass('active');

// Scrape button on App
var subreddit = document.getElementById('subreddit')
var subredditPosts = document.getElementById('posts')
var subredditLimit = document.getElementById('limit')
var scrapeBtn = document.getElementById('scrape-btn')

subreddit.addEventListener("input", function(){
    scrapeBtn.disabled = !this.value;
  })

$(document).ready(function() {
    const ctx = document.getElementById("redditChart").getContext('2d');
    const redditChart = new Chart(ctx, {
        type: 'bar',
        data: {},
        options: {}
    });

    subredditPosts.addEventListener("keypress", function(event){
        if (event.key === 'Enter') {
            redditScrapeFunction()
        }
    })
    
    subredditLimit.addEventListener("keypress", function(event){
        if (event.key === 'Enter') {
            redditScrapeFunction()
        }
    })

    subreddit.addEventListener("keypress", function(event){
        if (event.key === 'Enter') {
            redditScrapeFunction()
        }
    })

    $('.btn').click(function(){
        redditScrapeFunction()
    })

    function redditScrapeFunction(){
        if ( !$('#subreddit')) {
            subredditInput = 100
        }   else {
            subredditInput = $('#subreddit').val()
        }

        if ($('#posts').val() >= 100) {
            subredditInput = 100;
            $('#posts').val(100)
        }   else {
            subredditInput = $('#posts').val()
        }
        
        if ($('#limit').val() >= 30) {
            subredditInput = 30;
            $('#limit').val(30)

        }   else {
            subredditInput = $('#limit').val()
        }

        $.ajax({
            url: '/scrape_ajax',
            method: 'get',
            contentType: 'application/json',
            data: {
                subreddit_input: $('#subreddit').val(),
                posts_input: $('#posts').val(),
                limit_input: $('#limit').val()
            },
            success: function(ajaxData){
                chartData = {
                    labels: ajaxData.labels,
                    datasets: [
                        {
                            label: 'Occurrence in titles',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)'
                              ],
                            borderWidth: 1,
                            data: ajaxData.data
                        }],
                    scale: {
                        ticks: {
                            precision: 0
                            }
                        }
                    },
                
                redditChart.data = chartData;
                redditChart.options = chartData;
                redditChart.update();
            }
        })
    }
})