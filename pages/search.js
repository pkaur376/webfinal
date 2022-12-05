import {Form, Row, Col, Button} from "react-bootstrap"
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai'
import { searchHistoryAtom } from '../store.js';

export default function AdvancedSearch(data) {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();
    function navigateTheRoute(e, route){
        router.push(`/artwork?${route}`);
    };
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues:{
            q:"",
            searchBy:"title",
            geoLocation:"",
            medium:"",
            isHighlight:false,
            isOnView:false
        }
    });
    var queryString="";
    
    async function submit(data){
        queryString=`${data.searchBy}=true${data.geoLocation!=""?"&geoLocation="+data.geoLocation:""}${data.medium!=""?"&medium="+data.medium:""}&isOnView=${data.isOnView}&isHighlight=${data.isHighlight}&q=${data.q}`
        router.push(`/artwork?${queryString}`)
        setSearchHistory(await addToHistory(queryString))
    }
    return (
        <Form onSubmit={handleSubmit((data)=>{
            submit(data)
        })}>
        <Row>
            <Col>
            <Form.Group className="mb-3">
                <Form.Label>Search Query</Form.Label>
                <Form.Control type="text" name="q" {...register("q", { required: true})} className={errors.q && "is-invalid"}/>
                {errors.q?.type === "required" }
            </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={4}>
            <Form.Label>Search By</Form.Label>
            <Form.Select name="searchBy" className="mb-3" {...register("searchBy")}/*onChange={(e) => setSearchBy(e.target.value)}*/>
                <option value="title">Title</option>
                <option value="tags">Tags</option>
                <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
            </Col>
            <Col md={4}>
            <Form.Group className="mb-3">
                <Form.Label>Geo Location</Form.Label>
                <Form.Control type="text" placeholder="" name="geoLocation" {...register("geoLocation")}/*onChange={(e) => setGeoLocation(e.target.value)}*//>
                <Form.Text className="text-muted">
                Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
            </Form.Text>
            </Form.Group>
            </Col>
            <Col md={4}>
            <Form.Group className="mb-3">
                <Form.Label>Medium</Form.Label>
                <Form.Control type="text" placeholder="" name="medium" {...register("medium")}/*onChange={(e) => setMedium(e.target.value)}*//>
                <Form.Text className="text-muted">
                Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
            </Form.Text>
            </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
            <Form.Check
                type="checkbox"
                label="Highlighted"
                name="isHighlight"
                {...register("isHighlight")}
            />
            <Form.Check
                type="checkbox"
                label="Currently on View"
                name="isOnView"
                {...register("isOnView")}
            />
            </Col>
        </Row>
        <Row>
            <Col>
            <br />
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Col>
        </Row>
        </Form>
    )
  }
  