import React from "react";
import { withTranslation, useTranslation } from "react-i18next";

function Welcome() {
    const { t } = useTranslation();
    return (
        <main>
            <h2>{t('mainPage')}</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas nostrum atque distinctio culpa, incidunt dignissimos, debitis porro eaque quod rem reprehenderit iste adipisci sed exercitationem, itaque saepe? Itaque, minima pariatur?
            Eos reprehenderit, amet natus ullam non blanditiis molestiae exercitationem fugiat, similique, tempore obcaecati omnis excepturi maiores dolor sint ex ad doloremque doloribus a. Expedita voluptate ducimus illum optio saepe eaque!
            Praesentium ipsam officia minima dolores veritatis quos, sequi blanditiis. Sunt incidunt ex expedita molestiae, commodi, mollitia inventore odio nobis error sed maxime eos quaerat eum ducimus harum dolore ut laudantium!
            Labore sequi eius ab atque harum necessitatibus eveniet totam? Fugiat, rerum nemo dolorum soluta alias et, dolorem labore veritatis aut corporis optio blanditiis quas quae, laboriosam ad ex sunt consequatur.
            Voluptatibus suscipit iusto veritatis assumenda modi debitis enim? Inventore ratione nemo quis exercitationem distinctio libero eius laborum! Quas id excepturi, earum sed deleniti sapiente ipsa architecto eius deserunt facilis animi.
            Dolor nam distinctio aliquid vero blanditiis enim beatae non, sit reiciendis fugiat officiis facere provident impedit ratione cumque magnam voluptate eum! Et non repudiandae placeat! Aliquam omnis ut delectus commodi.
            Corporis quisquam qui iusto voluptas autem, perspiciatis accusantium. Explicabo, ipsam! Officia, consectetur tempora perferendis distinctio fugit odio ipsam nam amet eveniet assumenda. Deleniti atque ducimus quasi cum beatae, ratione eveniet.
            Minus et veritatis officia, rem, rerum repellat praesentium quo illo saepe, dolorem quos. Vitae provident totam quod repudiandae eius accusantium id repellendus fuga, sequi deserunt soluta ullam, inventore, nihil porro.
            Eos, voluptatum sint! Vitae, accusantium quia libero et nam autem ea praesentium, quos modi eum exercitationem error ullam in officia neque maiores temporibus cum. Praesentium dolorum blanditiis quasi esse autem?
            Corporis reiciendis accusantium recusandae, illum deserunt eveniet amet dolorum consectetur, quasi velit eum consequuntur! Quaerat ex vero natus ab. Recusandae quos vero dolores velit! Maiores eligendi sit nulla quaerat ullam!</p>
        </main>
    );
}

export default withTranslation()(Welcome)