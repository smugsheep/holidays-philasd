<script>
    import { luxon } from "../luxon.js";
    import { onlySchoolDays } from "../js/stores.js";
    import { slide } from "svelte/transition";

    export let event;

    let DateTime = luxon.DateTime;
    let dateStart = DateTime.fromISO(event.date);
    let dateEnd = DateTime.fromISO(event.end);

    let expand = false;

    let dateHeader = dateFormat(event, "short");

    // handle days only.

    let remainDisplay;
    let totalDaysRemaining = Math.round(dateStart.diffNow("days").days); // used to be trunc + 1 lol
    let totalNoSchool =
        event.noSchoolCount + weekendDays(dateStart, totalDaysRemaining);

    if (event.summerBreak.value) {
        let summerEnd = DateTime.fromISO(event.summerBreak.date);
        let untilSummerEnd = Math.round(summerEnd.diffNow("days").days); // same here as above
        totalNoSchool +=
            untilSummerEnd - weekendDays(summerEnd, untilSummerEnd);
    }

    $: if ($onlySchoolDays) {
        remainDisplay -= totalNoSchool;
    } else {
        remainDisplay = totalDaysRemaining;
    }

    function weekendDays(dateObj, totalDaysRemaining) {
        // from https://stackoverflow.com/q/6210906
        // it's actually borked with luxon but w/e, can ignore because all inputs aren't weekends.
        // bc in luxon sunday = 7, not 0 kek
        var sundays = Math.floor(
            (totalDaysRemaining + ((dateObj.weekday + 6) % 7)) / 7
        );
        return (
            2 * sundays + (dateObj.weekday == 7) - (DateTime.now().weekday == 6)
        );
    }

    function dateFormat(event, type) {
        let dateStr;
        switch (type) {
            case "short":
                dateStr = DateTime.fromISO(event.date).toFormat("y.MM.dd");
                if (event.end) {
                    dateStr +=
                        " \u2013 " +
                        DateTime.fromISO(event.end).toFormat("MM.dd");
                }
                break;
            // case "long":
            //     dateStr = DateTime.fromISO(event.date).toLocaleString(DateTime.DATE_HUGE);
            //     if (event.end) {
            //         dateStr += " through " + DateTime.fromISO(event.end).toLocaleString(DateTime.DATE_HUGE);
            //     }
            //     break;
            default:
                dateStr = "wrong type Dumbfuck";
        }
        return dateStr;
    }

    class Countdown {
        constructor() {
            this.isOn = false;
            this.timer;
        }

        start() {
            countdownDisplay = timeDiff(dateStart);

            this.timer = setInterval(() => {
                countdownDisplay = timeDiff(dateStart);
            }, 1000);

            this.isOn = true;
        }

        stop() {
            clearInterval(this.timer);
            this.isOn = false;
        }
    }

    let countdown = new Countdown();
    let countdownDisplay;

    function expandCard() {
        expand = !expand;
        if (countdown.isOn) {
            countdown.stop();
        } else {
            countdown.start();
        }
    }

    function timeDiff(date) {
        let diff = date.diffNow(["days", "hours", "minutes", "seconds"]);
        let format = `${diff.days}d ${diff.hours}h ${
            diff.minutes
        }m ${Math.trunc(diff.seconds)}s`;
        return format;
    }

    function olduseless() {
        // let parseStack = [
        //     "months",
        //     "weeks",
        //     "days",
        //     "hours",
        //     "minutes",
        //     "seconds",
        //     "milliseconds",
        // ];
        // let countdown = timeDiff(dateStart);
        // function timeDiff(date) {
        //     let diff = date.diffNow(parseStack);
        //     let format = `${diff.months}m ${diff.weeks}w ${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`;
        //     return format;
        // }
        // setInterval(() => {
        //     countdown = timeDiff(dateStart);
        // }, 1000);
    }
</script>

<div class="card-wrapper" on:click={expandCard} transition:slide|local="{{duration: 950 }}">
    <div class="kitkat">
        <span class="date">{dateHeader}</span>
        <span class="category">{event.type}</span>
    </div>
    <div class="card">
        <div class="title">{event.name}</div>
        <div>
            {#if remainDisplay == 1}
                <p>{remainDisplay} day remains</p>
            {:else if remainDisplay < 0}
                <p>{-remainDisplay} days since</p>
            {:else}
                <p>{remainDisplay} days remaining</p>
            {/if}
        </div>
    </div>
    {#if expand}
        <div class="card-expand" transition:slide|local>
            <i class="addit">additional information</i>
            <div class="info">
                <div>
                    <p>
                        falls on a <b>{dateStart.weekdayLong}</b>{#if event.end}, through a <b>{dateEnd.weekdayLong}</b>{/if}
                    </p>
                </div>
                <div class="card-countdown">
                    {countdownDisplay}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .card {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .card-wrapper {
        border-top: 1px solid rgb(192, 192, 192);
        padding: 2em 0;
        position: relative;
        /* transition: all 0.3s 0s ease; */
    }

    .card-wrapper:last-of-type {
        border-bottom: 1px solid rgb(192, 192, 192);
    }

    .card-wrapper:hover {
        cursor: pointer;
        /* opacity: 0.6; */
        /* transition: all 0.3s 0s ease; */
    }

    .card-wrapper::before, .card-wrapper::after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        z-index: 100;
        background: linear-gradient(90deg, rgb(50, 40, 40),rgb(132, 100, 100));
        transform-origin: bottom right;
        transition: transform 0.35s ease-in-out;
    }

    .card-wrapper::before {
        inset-block-start: -1px;
        /* opacity: 0; */
    }

    .card-wrapper::after {
        inset-block-end: -1px;
    }

    .card-wrapper:hover::before, .card-wrapper:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }

    /* .card-wrapper:active > * {
        opacity: 0.6;
    } */

    .card-expand {
        padding-top: 1em;
    }

    .card-countdown {
        font-family: "Roboto Mono", monospace;
        font-size: 1.3em;
        margin-left: 1em;
        padding: 0.8rem;
        border: 1px dotted rgb(192, 192, 192);
    }
    
    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .addit {
        font-size: 1em;
        display: flex;
        align-items: center;
        margin-bottom: 0.6rem;
        color: rgb(160, 160, 160);
        padding: 1rem 0;
    }

    .addit::after {
        content: "";
        margin: 0.4rem 0;
        height: 1px;
        flex: 1;
        margin-left: 1em;
        background-color: rgb(192, 192, 192);
    }

    .kitkat {
        display: flex;
        align-items: center;
    }

    .date {
        font-family: "Roboto Mono", monospace;
    }

    .category {
        background-color: rgb(243, 149, 164);
        color: white;
        padding: 0.4em 0.6em;
        margin-left: 1em;
        font-size: 0.8em;
    }

    .title {
        padding-top: 0.5em;
        font-weight: 600;
    }

    /* @media (max-width: 840px) {
    } */
</style>
