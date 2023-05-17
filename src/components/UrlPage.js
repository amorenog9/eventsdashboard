import kafka_logo from '../images/kafka_logo.png'
import spark_logo from '../images/spark_logo.png'
import flink_logo from '../images/flink_logo.png'
import './../css/UrlPage.css';


function UrlPage(props) {

  return (
    <div class="containerURL">

      <div class="kafka">
        <img src={kafka_logo} alt="Kafka" />
        <div class="link_kafka">
          <a href="http://localhost:9080/">Interfaz visual de Apache Kafka</a>
        </div>
      </div>

      <div class="flink">
        <img src={flink_logo} alt="Flink" />
        <div class="link_flink">
          <a href="http://localhost:7080/">Cluster para visualizar los jobs de flink</a>
        </div>
      </div>
      <div class="spark">
        <img src={spark_logo} alt="Spark" />
        <div class="link_spark">
          <a href="http://localhost:8080/">Cluster para visualizar los jobs de spark</a>
        </div>
      </div>


    </div>
  );
}

export default UrlPage;




