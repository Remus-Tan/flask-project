$('a[href="' + this.location.pathname + '"]').addClass('active');

// Scrape button on App
let subreddit = document.getElementById('subreddit')
let scrapeBtn = document.getElementById('scrape-btn')

subreddit.addEventListener("input", function(){
    scrapeBtn.disabled = !this.value;
  })

$(document).ready(function() {   
    const ctx = document.getElementById('redditChart').getContext('2d');
    const redditChart = new Chart(ctx, {
        type: 'bar',
        data: {},
        options: {}
    })

    $('.btn').click(function(){
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
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                              ],
                            borderWidth: 1,
                            data: ajaxData.data
                        }
                    ]},

                options = {
                    scale: {
                        ticks: {
                            precision: 0
                            }
                        }
                    }
                
                redditChart.data = chartData;
                redditChart.options = chartData;
                redditChart.update();
            }
        })
    })
})  
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });